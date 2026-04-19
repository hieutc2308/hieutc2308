"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Send } from "lucide-react";

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:hieutc2308@gmail.com?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const inputClass =
    "w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors duration-200";

  return (
    <section id="contact" className="relative py-24 md:py-32 px-6">


      <div ref={ref} className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.6, 0, 0.25, 1] }}
          >
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5z" fill="currentColor" /></svg>
              <span className="shine-text">Let's talk</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">Contact</h2>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Have a question or a project in mind? Feel free to reach out — I'll get back to you as soon as possible.
            </p>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Hanoi, Vietnam</span>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.6, 0, 0.25, 1] }}
            className="flex flex-col gap-4"
          >
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={inputClass}
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className={inputClass}
            />
            <textarea
              required
              placeholder="Message"
              rows={5}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className={`${inputClass} resize-none`}
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-semibold text-zinc-100 hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200 active:scale-[0.98]"
            >
              {sent ? "Opened in mail client ✓" : (
                <><Send className="w-4 h-4" /> Submit</>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
