require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// In-memory room store
// rooms[roomId] = { users: { socketId: { name, receiveLang } } }
const rooms = {};

async function translateMessage(text, targetLanguage) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `You are a translator. The user may type in any language including Telugu, Hindi, English, Spanish, or mixed languages like Telugu+English (Tenglish) or Hindi+English (Hinglish).

Detect the language of this message and translate it naturally into ${targetLanguage}. Keep the tone casual and natural, not robotic.

Message: ${text}

Reply with ONLY the translated text. Nothing else.`,
      },
    ],
    max_tokens: 500,
    temperature: 0.3,
  });
  return completion.choices[0].message.content.trim();
}

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-room", ({ roomId, userName, receiveLang }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = { users: {} };
    }

    rooms[roomId].users[socket.id] = { name: userName, receiveLang };
    socket.join(roomId);

    socket.emit("room-joined", { roomId });

    socket.to(roomId).emit("user-joined", { name: userName });

    console.log(`${userName} joined room ${roomId} (receive in ${receiveLang})`);
  });

  socket.on("update-language", ({ roomId, receiveLang }) => {
    if (rooms[roomId] && rooms[roomId].users[socket.id]) {
      rooms[roomId].users[socket.id].receiveLang = receiveLang;
      console.log(`${rooms[roomId].users[socket.id].name} updated language to ${receiveLang}`);
    }
  });

  socket.on("send-message", async ({ roomId, message, senderName }) => {
    if (!rooms[roomId]) return;

    const users = rooms[roomId].users;

    // Send back to sender immediately (no translation needed)
    socket.emit("receive-message", {
      senderName,
      original: message,
      translated: null,
      isSelf: true,
    });

    // Translate and send to each other user
    const otherSockets = Object.entries(users).filter(([sid]) => sid !== socket.id);

    for (const [targetSocketId, targetUser] of otherSockets) {
      try {
        const translated = await translateMessage(message, targetUser.receiveLang);
        io.to(targetSocketId).emit("receive-message", {
          senderName,
          original: message,
          translated,
          isSelf: false,
        });
      } catch (err) {
        console.error("Translation error:", err.message);
        io.to(targetSocketId).emit("receive-message", {
          senderName,
          original: message,
          translated: null,
          translationFailed: true,
          isSelf: false,
        });
      }
    }
  });

  socket.on("disconnect", () => {
    for (const roomId of Object.keys(rooms)) {
      const room = rooms[roomId];
      if (room.users[socket.id]) {
        const userName = room.users[socket.id].name;
        delete room.users[socket.id];
        socket.to(roomId).emit("user-left", { name: userName });
        console.log(`${userName} left room ${roomId}`);

        // Clean up empty rooms
        if (Object.keys(room.users).length === 0) {
          delete rooms[roomId];
        }
      }
    }
  });
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`LingoBridge server running on port ${PORT}`);
});
