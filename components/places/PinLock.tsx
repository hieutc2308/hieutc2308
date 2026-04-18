"use client";

import { useState, useEffect, useRef } from "react";
import { Lock } from "lucide-react";

export function PinLock({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem("places_unlocked") === "true") {
      setUnlocked(true);
    }
    setChecking(false);
  }, []);

  async function verify(fullPin: string) {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: fullPin }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("places_unlocked", "true");
        setUnlocked(true);
      } else {
        setError(true);
        setPin(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } finally {
      setLoading(false);
    }
  }

  function handleInput(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...pin];
    next[index] = value;
    setPin(next);
    setError(false);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 3) {
      const full = [...next].join("");
      if (full.length === 4) verify(full);
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  if (checking) return null;
  if (unlocked) return <>{children}</>;

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6">
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-sm w-full -mt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Private Access</h1>
          <p className="text-zinc-500 text-sm">Enter the 4-digit PIN to continue</p>
        </div>

        <div className="flex gap-3">
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={loading}
              autoFocus={i === 0}
              className={`w-14 h-14 text-center text-xl font-bold rounded-xl border bg-zinc-900 text-zinc-100 outline-none transition-all duration-200
                ${error
                  ? "border-red-500/60 text-red-400"
                  : digit
                  ? "border-blue-500/60"
                  : "border-zinc-700 focus:border-blue-500/60"
                }
                disabled:opacity-50`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm -mt-4">Incorrect PIN. Try again.</p>
        )}

        {loading && (
          <p className="text-zinc-500 text-sm -mt-4">Verifying…</p>
        )}

        <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mt-2">
          <Lock className="w-6 h-6 text-blue-400" />
        </div>
      </div>
    </main>
  );
}
