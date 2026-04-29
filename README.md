# LingoBridge

**Real-time multilingual chat — no sign-up, no delays, just talk.**

LingoBridge lets people who speak different languages chat in the same room. You type in Telugu, your friend reads it in Spanish, another person reads it in French — all at the same time, powered by AI.

**Live demo:** https://lingo-bridge-nine.vercel.app

---

## What it does

- Create a room instantly — get a unique 8-character code
- Share the code with anyone in the world
- Each person picks their language
- Every message is auto-translated by AI for each recipient
- No accounts, no history, no setup

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | Node.js, Express |
| Real-time | Socket.IO |
| AI Translation | OpenAI GPT-4o mini |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Uptime Monitoring | UptimeRobot |

---

## Supported Languages

🇬🇧 English · 🇮🇳 Telugu · 🇮🇳 Hindi · 🇪🇸 Spanish · 🇫🇷 French · 🇯🇵 Japanese · 🇸🇦 Arabic · 🇮🇳 Tamil

---

## How it works

1. User A creates a room and picks their language (e.g. Telugu)
2. User B joins with the room code and picks their language (e.g. Spanish)
3. User A sends a message in Telugu
4. The backend receives it, calls OpenAI to translate it into Spanish for User B
5. User B receives the translated message in real time via Socket.IO
6. Both users see the original and translated text

---

## Project Structure

```
LingoBridge/
├── client/          # Next.js frontend
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   └── room/[roomId]/page.tsx # Chat room
│   └── package.json
├── server/          # Node.js backend
│   ├── index.js     # Express + Socket.IO server
│   └── package.json
└── README.md
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- An OpenAI API key

### 1. Clone the repo

```bash
git clone https://github.com/ManoHarshaSappa/LingoBridge.git
cd LingoBridge
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=4000
CLIENT_URL=http://localhost:3000
```

Start the server:

```bash
npm run dev
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd client
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

### 4. Open the app

Go to `http://localhost:3000` — open two tabs, create a room in one, join in the other, pick different languages and start chatting.

---

## Deployment

### Frontend — Vercel

1. Connect your GitHub repo to Vercel
2. Set **Root Directory** to `client`
3. Set **Framework Preset** to `Next.js`
4. Add environment variable:
   ```
   NEXT_PUBLIC_SOCKET_URL = https://your-render-backend-url.onrender.com
   ```
5. Deploy

### Backend — Render

1. Create a new **Web Service** on Render
2. Connect your GitHub repo, set **Root Directory** to `server`
3. Set **Build Command** to `npm install`
4. Set **Start Command** to `node index.js`
5. Add environment variables:
   ```
   OPENAI_API_KEY = your_openai_api_key
   PORT = 4000
   CLIENT_URL = https://your-vercel-app.vercel.app
   ```
6. Deploy

### Keep Render Awake (Free Tier)

Render's free tier sleeps after 15 minutes of inactivity. Use [UptimeRobot](https://uptimerobot.com) — set it to ping `https://your-render-url.onrender.com/health` every 5 minutes for free.

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `PORT` | Port to run the server on (default: 4000) |
| `CLIENT_URL` | Your frontend URL (for CORS) |

### Client (`client/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SOCKET_URL` | Your backend server URL |

---

## Author

**Mano Harsha Sappa**

- Portfolio: https://manoharshasappa.github.io/portfolio_ManoHarshaSappa/
- LinkedIn: https://www.linkedin.com/in/manoharshasappa/
- GitHub: https://github.com/ManoHarshaSappa
