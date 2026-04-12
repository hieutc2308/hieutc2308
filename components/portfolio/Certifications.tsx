"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Award, University } from "lucide-react";
import resume from "@/data/resume.json";

export function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="certifications" className="py-24 md:py-32 px-6 bg-zinc-950/30">
      <div className="max-w-4xl mx-auto">
        <div ref={ref} className="mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4 block"
          >
            Credentials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold text-zinc-100"
          >
            Certifications
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resume.certifications.map((cert, index) => (
            <motion.a
              key={cert.title}
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + index * 0.1,
                ease: [0.6, 0, 0.25, 1],
              }}
              whileHover={{ y: -4, borderColor: "rgba(59,130,246,0.4)" }}
              className="group flex flex-col p-6 rounded-2xl border border-zinc-800 transition-all duration-300 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #1e2433 0%, #18181b 60%, #131318 100%)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-400" />
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </div>

              <h3 className="font-semibold text-zinc-100 mb-1 leading-snug">
                {cert.title}
              </h3>
              <p className="text-sm text-zinc-500 mt-auto pt-3">{cert.issuer}</p>
            </motion.a>
          ))}
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 rounded-2xl border border-zinc-800 flex items-center gap-4 p-6"
          style={{
            background: "linear-gradient(135deg, #1e2433 0%, #18181b 60%, #131318 100%)",
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
            <University className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <p className="font-semibold text-zinc-100">{resume.education[0].institution}</p>
            <p className="text-sm text-zinc-500">
              {resume.education[0].degree} · {resume.education[0].area}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
