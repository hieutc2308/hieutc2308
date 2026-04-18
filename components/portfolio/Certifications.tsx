"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Award, University } from "lucide-react";
import resume from "@/data/resume.json";

export function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stripStyle = {
    background: "rgba(255,255,255,0.03)",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.25)",
  };

  const stripHover = {
    background: "rgba(255,255,255,0.055)",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.10), 0 4px 16px rgba(0,0,0,0.35)",
  };

  return (
    <section id="certifications" className="py-24 md:py-32 px-6">
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

        <div className="flex flex-col gap-3">
          {resume.certifications.map((cert, index) => (
            <motion.a
              key={cert.title}
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.08,
                ease: [0.6, 0, 0.25, 1],
              }}
              style={stripStyle}
              whileHover={stripHover}
              className="group flex items-center gap-5 p-5 rounded-3xl cursor-pointer transition-colors duration-150"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center">
                <Award className="w-5 h-5 text-zinc-400 group-hover:text-zinc-300 transition-colors duration-150" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-100 leading-snug">{cert.title}</p>
                <p className="text-sm text-zinc-500 mt-0.5">{cert.issuer}</p>
              </div>

              <ExternalLink className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 flex-shrink-0 transition-colors duration-150" />
            </motion.a>
          ))}

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 + resume.certifications.length * 0.08, ease: [0.6, 0, 0.25, 1] }}
            style={stripStyle}
            className="flex items-center gap-5 p-5 rounded-3xl"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center">
              <University className="w-5 h-5 text-zinc-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-zinc-100 leading-snug">{resume.education[0].institution}</p>
              <p className="text-sm text-zinc-500 mt-0.5">
                {resume.education[0].degree} · {resume.education[0].area}
              </p>
            </div>

            <span className="text-xs text-zinc-600 flex-shrink-0">Education</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
