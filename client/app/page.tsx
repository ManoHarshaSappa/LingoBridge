"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function generateRoomId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

const LANGUAGES = [
  { name: "English", flag: "🇬🇧" },
  { name: "Telugu", flag: "🇮🇳" },
  { name: "Hindi", flag: "🇮🇳" },
  { name: "Spanish", flag: "🇪🇸" },
  { name: "French", flag: "🇫🇷" },
  { name: "Japanese", flag: "🇯🇵" },
  { name: "Arabic", flag: "🇸🇦" },
  { name: "Tamil", flag: "🇮🇳" },
];

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
    <main className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}>

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shadow-lg"
            style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}>
            🌐
          </div>
          <span className="text-white font-bold text-lg">LingoBridge</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="https://github.com/ManoHarshaSappa" target="_blank" rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition text-sm">GitHub</a>
          <a href="https://www.linkedin.com/in/manoharshasappa/" target="_blank" rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition text-sm">LinkedIn</a>
          <a href="https://manoharshasappa.github.io/portfolio_ManoHarshaSappa/" target="_blank" rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition text-sm">Portfolio</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center px-4 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs text-slate-300 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Real-time AI Translation · 8 Languages · Free
        </div>

        <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl shadow-2xl"
          style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}>
          🌐
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
          Chat in{" "}
          <span style={{
            background: "linear-gradient(135deg, #a78bfa, #f472b6, #fb923c)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Any Language
          </span>
          ,<br />Instantly
        </h1>
        <p className="text-slate-400 text-lg max-w-md mb-10">
          Create a room, share the code, and talk to anyone — LingoBridge auto-translates every message in real time using AI.
        </p>

        {/* CARD */}
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="flex border-b border-white/10">
            <button onClick={() => { setTab("create"); setError(""); }}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${tab === "create" ? "text-white border-b-2 border-pink-500" : "text-slate-400 hover:text-white"}`}>
              Create Room
            </button>
            <button onClick={() => { setTab("join"); setError(""); }}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${tab === "join" ? "text-white border-b-2 border-emerald-400" : "text-slate-400 hover:text-white"}`}>
              Join Room
            </button>
          </div>

          <div className="p-6 space-y-4">
            {error && (
              <div className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</div>
            )}
            {tab === "create" ? (
              <>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">👤</span>
                  <input type="text" placeholder="Your name" value={createName}
                    onChange={(e) => { setCreateName(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    className="w-full bg-white/10 text-white placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 focus:outline-none focus:border-pink-500 transition text-sm" />
                </div>
                <button onClick={handleCreate}
                  className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm transition active:scale-95 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}>
                  Create New Room ✨
                </button>
              </>
            ) : (
              <>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">👤</span>
                  <input type="text" placeholder="Your name" value={joinName}
                    onChange={(e) => { setJoinName(e.target.value); setError(""); }}
                    className="w-full bg-white/10 text-white placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 focus:outline-none focus:border-emerald-400 transition text-sm" />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔑</span>
                  <input type="text" placeholder="Room code (e.g. AB12CD34)" value={roomCode}
                    onChange={(e) => { setRoomCode(e.target.value.toUpperCase()); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                    className="w-full bg-white/10 text-white placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 focus:outline-none focus:border-emerald-400 transition text-sm font-mono tracking-widest" />
                </div>
                <button onClick={handleJoin}
                  className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm transition active:scale-95 shadow-lg bg-emerald-500 hover:bg-emerald-400">
                  Join Room →
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-slate-500 text-xs mt-5">No sign-up · No history · Just chat</p>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-white/10 bg-white/5 py-8 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "8", label: "Languages" },
            { value: "AI", label: "Powered Translation" },
            { value: "0s", label: "Sign-up Time" },
            { value: "∞", label: "Rooms Available" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-extrabold text-white">{stat.value}</div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO PHONES */}
      <section className="py-20 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs text-slate-300 mb-4">
          Live Demo
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">See it in action</h2>
        <p className="text-slate-400 mb-14">Two people. Two languages. One conversation — no confusion.</p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">

          {/* Phone 1 — Priya (Telugu) */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold">PR</div>
              <div className="text-left">
                <div className="text-white text-sm font-semibold">Priya</div>
                <div className="text-slate-400 text-xs">Reads in Telugu 🇮🇳</div>
              </div>
            </div>
            <div className="w-56 bg-slate-900 rounded-[2.5rem] border-4 border-slate-700 shadow-2xl overflow-hidden" style={{ height: 430 }}>
              <div className="bg-slate-900 flex justify-center pt-3 pb-2">
                <div className="w-20 h-5 bg-slate-700 rounded-full" />
              </div>
              <div className="px-3 py-2 flex items-center gap-2" style={{ background: "linear-gradient(135deg, #075e54, #128c7e)" }}>
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">CA</div>
                <div>
                  <div className="text-white text-xs font-semibold">Carlos</div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-white/60 text-[9px]">online</span>
                  </div>
                </div>
              </div>
              <div className="px-2 py-3 space-y-2.5" style={{ background: "#eae6df", height: 300, overflowY: "hidden" }}>
                <div className="flex items-end gap-1">
                  <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white text-[8px] font-bold shrink-0">CA</div>
                  <div className="bg-white rounded-xl rounded-tl-sm px-2.5 py-2 max-w-[82%] shadow-sm">
                    <p className="text-gray-800 text-[10px] font-semibold">నమస్కారం! ఎలా ఉన్నారు?</p>
                    <p className="text-gray-400 text-[8px] italic mt-0.5">Hola! ¿Cómo estás?</p>
                    <p className="text-gray-300 text-[8px] text-right mt-0.5">10:30</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="px-2.5 py-2 rounded-xl rounded-tr-sm max-w-[82%] shadow-sm" style={{ background: "#dcf8c6" }}>
                    <p className="text-gray-800 text-[10px]">బాగున్నాను! మీరు?</p>
                    <p className="text-gray-300 text-[8px] text-right mt-0.5">10:31 ✓✓</p>
                  </div>
                </div>
                <div className="flex items-end gap-1">
                  <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white text-[8px] font-bold shrink-0">CA</div>
                  <div className="bg-white rounded-xl rounded-tl-sm px-2.5 py-2 max-w-[82%] shadow-sm">
                    <p className="text-gray-800 text-[10px] font-semibold">నేను కూడా బాగున్నాను!</p>
                    <p className="text-gray-400 text-[8px] italic mt-0.5">¡Yo también estoy bien!</p>
                    <p className="text-gray-300 text-[8px] text-right mt-0.5">10:31</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="px-2.5 py-2 rounded-xl rounded-tr-sm max-w-[82%] shadow-sm" style={{ background: "#dcf8c6" }}>
                    <p className="text-gray-800 text-[10px]">LingoBridge చాలా బాగుంది! 🌐</p>
                    <p className="text-gray-300 text-[8px] text-right mt-0.5">10:32 ✓✓</p>
                  </div>
                </div>
              </div>
              <div className="px-2 py-2 flex items-center gap-1.5" style={{ background: "#f0f0f0" }}>
                <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[9px] text-gray-400">Type in Telugu...</div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #075e54, #128c7e)" }}>
                  <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-2">
            <div className="hidden md:flex flex-col items-center gap-1 text-slate-400">
              <div className="w-px h-10 bg-gradient-to-b from-transparent to-slate-600" />
              <div className="text-2xl">⇄</div>
              <div className="w-px h-10 bg-gradient-to-t from-transparent to-slate-600" />
            </div>
            <div className="md:hidden text-slate-400 text-3xl">⇅</div>
            <div className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs text-slate-300">AI translates</div>
          </div>

          {/* Phone 2 — Carlos (Spanish) */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">CA</div>
              <div className="text-left">
                <div className="text-white text-sm font-semibold">Carlos</div>
                <div className="text-slate-400 text-xs">Reads in Spanish 🇪🇸</div>
              </div>
            </div>
            <div className="w-56 bg-slate-900 rounded-[2.5rem] border-4 border-slate-700 shadow-2xl overflow-hidden" style={{ height: 430 }}>
              <div className="bg-slate-900 flex justify-center pt-3 pb-2">
                <div className="w-20 h-5 bg-slate-700 rounded-full" />
              </div>
              <div className="px-3 py-2 flex items-center gap-2" style={{ background: "linear-gradient(135deg, #075e54, #128c7e)" }}>
                <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">PR</div>
                <div>
                  <div className="text-white text-xs font-semibold">Priya</div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-white/60 text-[9px]">online</span>
                  </div>
                </div>
              </div>
              <div className="px-2 py-3 space-y-2.5" style={{ background: "#eae6df", height: 300, overflowY: "hidden" }}>
                <div className="flex justify-end">
                  <div className="px-2.5 py-2 rounded-xl rounded-tr-sm max-w-[82%] shadow-sm" style={{ background: "#dcf8c6" }}>
                    <p className="text-gray-800 text-[10px]">Hola! ¿Cómo estás?</p>
                    <p className="text-gray-300 text-[8px] text-right mt-0.5">10:30 ✓✓</p>
                  </div>
                </div>
                <div className="flex items-end gap-1">
                  <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-white text-[8px] font-bold shrink-0">PR</div>
                  <div className="bg-white rounded-xl rounded-tl-sm px-2.5 py-2 max-w-[82%] shadow-sm">
                    <p className="text-gray-800 text-[10px] font-semibold">¡Estoy bien! ¿Y tú?</p>
                    <p className="text-gray-400 text-[8px] italic mt-0.5">బాగున్నాను! మీరు?</p>
                    <p className="text-gray-300 text-[8px] text-right mt-0.5">10:31</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="px-2.5 py-2 rounded-xl rounded-tr-sm max-w-[82%] shadow-sm" style={{ background: "#dcf8c6" }}>
                    <p className="text-gray-800 text-[10px]">¡Yo también estoy bien!</p>
                    <p className="text-gray-300 text-[8px] text-right mt-0.5">10:31 ✓✓</p>
                  </div>
                </div>
                <div className="flex items-end gap-1">
                  <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-white text-[8px] font-bold shrink-0">PR</div>
                  <div className="bg-white rounded-xl rounded-tl-sm px-2.5 py-2 max-w-[82%] shadow-sm">
                    <p className="text-gray-800 text-[10px] font-semibold">¡LingoBridge es increíble! 🌐</p>
                    <p className="text-gray-400 text-[8px] italic mt-0.5">LingoBridge చాలా బాగుంది!</p>
                    <p className="text-gray-300 text-[8px] text-right mt-0.5">10:32</p>
                  </div>
                </div>
              </div>
              <div className="px-2 py-2 flex items-center gap-1.5" style={{ background: "#f0f0f0" }}>
                <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[9px] text-gray-400">Type in Spanish...</div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #075e54, #128c7e)" }}>
                  <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-sm mt-12 max-w-md mx-auto">
          Each person reads every message in their own language — AI handles all the translation automatically
        </p>
      </section>

      {/* LANGUAGES */}
      <section className="py-16 px-4 text-center border-t border-white/10">
        <h2 className="text-3xl font-bold text-white mb-2">8 Languages Supported</h2>
        <p className="text-slate-400 mb-10">Translate between any combination, instantly</p>
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {LANGUAGES.map((lang) => (
            <div key={lang.name}
              className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-white hover:bg-white/20 transition cursor-default">
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 text-center border-t border-white/10">
        <h2 className="text-3xl font-bold text-white mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {[
            { step: "01", icon: "🏠", title: "Create a Room", desc: "Enter your name and create a room. You get a unique 8-character code instantly." },
            { step: "02", icon: "🔗", title: "Share the Code", desc: "Send the room code to anyone in the world. They join in one click, no account needed." },
            { step: "03", icon: "💬", title: "Chat Freely", desc: "Each person picks their language. AI translates every message in real time — seamlessly." },
          ].map((item) => (
            <div key={item.step} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition">
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="text-xs text-slate-500 font-mono mb-1">Step {item.step}</div>
              <div className="text-white font-semibold mb-2">{item.title}</div>
              <div className="text-slate-400 text-sm leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CREATOR */}
      <section className="py-16 px-4 text-center border-t border-white/10">
        <p className="text-slate-400 text-sm mb-8">Built by</p>
        <div className="max-w-xs mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold text-white shadow-xl"
            style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}>
            MS
          </div>
          <div className="text-white font-bold text-lg">Mano Harsha Sappa</div>
          <div className="text-slate-400 text-sm mt-1 mb-7">Full Stack Developer</div>
          <div className="flex flex-col gap-3">
            <a href="https://www.linkedin.com/in/manoharshasappa/" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#0077b5] hover:bg-[#006399] text-white text-sm font-medium py-2.5 rounded-xl transition">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <a href="https://github.com/ManoHarshaSappa" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2.5 rounded-xl transition border border-white/10">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a href="https://manoharshasappa.github.io/portfolio_ManoHarshaSappa/" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-white text-sm font-medium py-2.5 rounded-xl transition"
              style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d)" }}>
              🌐 Portfolio
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 border-t border-white/10">
        <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs mb-1">
          <span>Built with</span>
          <span className="text-red-400">♥</span>
          <span>by Mano Harsha Sappa · LingoBridge {new Date().getFullYear()}</span>
        </div>
        <div className="text-slate-600 text-xs">Powered by OpenAI GPT-4o · Next.js · Socket.IO</div>
      </footer>
    </main>
  );
}
