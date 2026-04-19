"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

const LANGUAGES = ["English", "Telugu", "Hindi", "Spanish", "French", "Japanese", "Arabic", "Tamil"];

type Message =
  | {
      type: "chat";
      id: string;
      senderName: string;
      original: string;
      translated: string | null;
      isSelf: boolean;
      translationFailed?: boolean;
      time: string;
    }
  | { type: "system"; id: string; text: string };

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = ["#e91e8c", "#00bcd4", "#ff5722", "#9c27b0", "#4caf50", "#ff9800", "#2196f3"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return colors[Math.abs(hash) % colors.length];
}

export default function ChatPage() {
  const params = useParams();
  const roomId = (params.roomId as string).toUpperCase();
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [receiveLang, setReceiveLang] = useState("English");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false); // kept for type compat, unused
  const [onlineCount, setOnlineCount] = useState(1);

  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingMsgIdRef = useRef<string | null>(null);

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  useEffect(() => {
    const name = sessionStorage.getItem("userName");
    if (!name) { router.replace("/"); return; }
    setUserName(name);

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join-room", { roomId, userName: name, receiveLang: "English" });
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("room-joined", () => {
      addMessage({ type: "system", id: crypto.randomUUID(), text: `You joined · Room ${roomId}` });
    });

    socket.on("user-joined", ({ name: n }: { name: string }) => {
      setOnlineCount((c) => c + 1);
      addMessage({ type: "system", id: crypto.randomUUID(), text: `${n} joined the chat` });
    });

    socket.on("user-left", ({ name: n }: { name: string }) => {
      setOnlineCount((c) => Math.max(1, c - 1));
      addMessage({ type: "system", id: crypto.randomUUID(), text: `${n} left` });
    });

    socket.on(
      "receive-message",
      ({ senderName, original, translated, isSelf, translationFailed }: {
        senderName: string; original: string; translated: string | null;
        isSelf: boolean; translationFailed?: boolean;
      }) => {
        if (isSelf && pendingMsgIdRef.current) {
          const id = pendingMsgIdRef.current;
          pendingMsgIdRef.current = null;
          setMessages((prev) => prev.map((m) =>
            m.id === id && m.type === "chat" ? { ...m } : m
          ));
          return;
        }
        if (!isSelf) {
          addMessage({
            type: "chat", id: crypto.randomUUID(),
            senderName, original, translated,
            isSelf: false, translationFailed, time: getTime(),
          });
        }
      }
    );

    return () => { socket.disconnect(); };
  }, [roomId, router, addMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleLangChange(lang: string) {
    setReceiveLang(lang);
    setShowLangMenu(false);
    socketRef.current?.emit("update-language", { roomId, receiveLang: lang });
  }

  function handleSend() {
    const text = input.trim();
    if (!text || !socketRef.current) return;
    const pendingId = crypto.randomUUID();
    pendingMsgIdRef.current = pendingId;
    addMessage({
      type: "chat", id: pendingId,
      senderName: userName, original: text,
      translated: null, isSelf: true, time: getTime(),
    });
    socketRef.current.emit("send-message", { roomId, message: text, senderName: userName });
    setInput("");
    inputRef.current?.focus();
  }

  function copyRoomCode() {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const flagMap: Record<string, string> = {
    English: "🇬🇧", Telugu: "🇮🇳", Hindi: "🇮🇳", Spanish: "🇪🇸",
    French: "🇫🇷", Japanese: "🇯🇵", Arabic: "🇸🇦", Tamil: "🇮🇳",
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto relative"
      style={{ background: "#eae6df" }}>

      {/* WhatsApp-style header */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0 shadow-md z-10"
        style={{ background: "linear-gradient(135deg, #075e54, #128c7e)" }}>
        <button onClick={() => router.push("/")} className="text-white/80 hover:text-white text-xl">
          ←
        </button>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner"
          style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}>
          🌐
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm truncate">Room: {roomId}</span>
            <button onClick={copyRoomCode}
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-full transition shrink-0">
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-300" : "bg-red-400"}`} />
            <span className="text-white/70 text-xs">
              {connected ? `${onlineCount} online` : "connecting..."}
            </span>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-2 py-1.5 shrink-0">
          <span className="text-base">{flagMap[receiveLang] || "🌍"}</span>
          <select
            value={receiveLang}
            onChange={(e) => handleLangChange(e.target.value)}
            className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer appearance-none pr-1"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="text-gray-800 bg-white">
                {lang}
              </option>
            ))}
          </select>
          <span className="text-white/60 text-xs">▾</span>
        </div>
      </div>

      {/* Chat background pattern */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8b8a2' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}>

        {messages.map((msg, idx) => {
          if (msg.type === "system") {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="text-xs text-gray-500 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                  {msg.text}
                </span>
              </div>
            );
          }

          const showAvatar = !msg.isSelf &&
            (idx === 0 || messages[idx - 1]?.type === "system" ||
              (messages[idx - 1]?.type === "chat" && (messages[idx - 1] as { senderName?: string }).senderName !== msg.senderName));

          if (msg.isSelf) {
            return (
              <div key={msg.id} className="flex justify-end mb-1">
                <div className="max-w-[72%] min-w-[80px]">
                  <div className="px-3 py-2 rounded-2xl rounded-tr-sm shadow-sm relative"
                    style={{ background: "#dcf8c6" }}>
                    <p className="text-gray-800 text-sm leading-relaxed pr-10">{msg.original}</p>
                    <span className="absolute bottom-1.5 right-2.5 text-gray-400 text-[10px]">
                      {msg.time} ✓✓
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex items-end gap-2 mb-1">
              <div className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                style={{
                  background: showAvatar ? getAvatarColor(msg.senderName) : "transparent",
                  visibility: showAvatar ? "visible" : "hidden",
                }}>
                {getInitials(msg.senderName)}
              </div>
              <div className="max-w-[72%] min-w-[80px]">
                {showAvatar && (
                  <p className="text-xs font-semibold mb-0.5 pl-1"
                    style={{ color: getAvatarColor(msg.senderName) }}>
                    {msg.senderName}
                  </p>
                )}
                <div className="bg-white px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm relative">
                  {msg.translationFailed ? (
                    <>
                      <p className="text-gray-800 text-sm leading-relaxed pr-10">{msg.original}</p>
                      <p className="text-red-400 text-xs mt-1">Translation failed</p>
                    </>
                  ) : msg.translated ? (
                    <>
                      <p className="text-gray-800 text-sm font-medium leading-relaxed pr-10">
                        {msg.translated}
                      </p>
                      <div className="mt-1 pt-1 border-t border-gray-100">
                        <p className="text-gray-400 text-xs italic leading-relaxed">
                          {msg.original}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 pr-10">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                  <span className="absolute bottom-1.5 right-2.5 text-gray-300 text-[10px]">
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* WhatsApp-style input bar */}
      <div className="px-3 py-2 shrink-0 flex items-end gap-2"
        style={{ background: "#f0f0f0" }}>
        <div className="flex-1 flex items-center bg-white rounded-3xl shadow-sm px-4 py-2 min-h-[48px]">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || !connected}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition active:scale-95 disabled:opacity-50 shrink-0"
          style={{ background: input.trim() && connected ? "linear-gradient(135deg, #075e54, #128c7e)" : "#a0aec0" }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 translate-x-0.5">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

    </div>
  );
}
