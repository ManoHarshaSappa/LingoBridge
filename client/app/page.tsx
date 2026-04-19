"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function generateRoomId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

export default function HomePage() {
  const router = useRouter();
  const [tab, setTab] = useState<"create" | "join">("create");
  const [createName, setCreateName] = useState("");
  const [joinName, setJoinName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  function handleCreate() {
    if (!createName.trim()) { setError("Enter your name first"); return; }
    const roomId = generateRoomId();
    sessionStorage.setItem("userName", createName.trim());
    router.push(`/room/${roomId}`);
  }

  function handleJoin() {
    if (!joinName.trim()) { setError("Enter your name first"); return; }
    if (!roomCode.trim()) { setError("Enter a room code"); return; }
    sessionStorage.setItem("userName", joinName.trim());
    router.push(`/room/${roomCode.trim().toUpperCase()}`);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>

      {/* Logo area */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center text-4xl shadow-2xl"
          style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}>
          🌐
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">LingoBridge</h1>
        <p className="text-slate-400 text-sm mt-1">Chat in any language, instantly</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => { setTab("create"); setError(""); }}
            className={`flex-1 py-4 text-sm font-semibold transition-all ${tab === "create"
              ? "text-white border-b-2 border-pink-500"
              : "text-slate-400 hover:text-white"}`}
          >
            Create Room
          </button>
          <button
            onClick={() => { setTab("join"); setError(""); }}
            className={`flex-1 py-4 text-sm font-semibold transition-all ${tab === "join"
              ? "text-white border-b-2 border-emerald-400"
              : "text-slate-400 hover:text-white"}`}
          >
            Join Room
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          {tab === "create" ? (
            <>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">👤</span>
                <input
                  type="text"
                  placeholder="Your name"
                  value={createName}
                  onChange={(e) => { setCreateName(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  className="w-full bg-white/10 text-white placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 focus:outline-none focus:border-pink-500 transition text-sm"
                />
              </div>
              <button
                onClick={handleCreate}
                className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm transition active:scale-95 shadow-lg"
                style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}
              >
                Create New Room ✨
              </button>
            </>
          ) : (
            <>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">👤</span>
                <input
                  type="text"
                  placeholder="Your name"
                  value={joinName}
                  onChange={(e) => { setJoinName(e.target.value); setError(""); }}
                  className="w-full bg-white/10 text-white placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 focus:outline-none focus:border-emerald-400 transition text-sm"
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔑</span>
                <input
                  type="text"
                  placeholder="Room code (e.g. AB12CD34)"
                  value={roomCode}
                  onChange={(e) => { setRoomCode(e.target.value.toUpperCase()); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  className="w-full bg-white/10 text-white placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 focus:outline-none focus:border-emerald-400 transition text-sm font-mono tracking-widest"
                />
              </div>
              <button
                onClick={handleJoin}
                className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm transition active:scale-95 shadow-lg bg-emerald-500 hover:bg-emerald-400"
              >
                Join Room →
              </button>
            </>
          )}
        </div>
      </div>

      <p className="text-slate-500 text-xs mt-6 text-center">
        No sign-up · No history · Just chat
      </p>
    </main>
  );
}
