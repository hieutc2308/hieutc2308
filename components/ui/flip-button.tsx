"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function FlipButton({
  text1,
  text2,
  onClick,
}: {
  text1: string;
  text2: string;
  onClick?: () => void;
}) {
  const [show, setShow] = useState(false);

  const flipVariants = {
    one: {
      rotateX: 0,
      backgroundColor: "#3B82F6",
      color: "#ffffff",
    },
    two: {
      rotateX: 180,
      backgroundColor: "#27272a",
      color: "#fafafa",
    },
  };

  return (
    <div className="w-full max-w-[270px]">
      <motion.button
        className="w-full cursor-pointer px-8 py-3 font-semibold text-sm"
        style={{ borderRadius: 999 }}
        onClick={() => {
          setShow(!show);
          onClick?.();
        }}
        animate={show ? "two" : "one"}
        variants={flipVariants}
        transition={{ duration: 0.6, type: "spring" }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          animate={{ rotateX: show ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          {show ? text1 : text2}
        </motion.div>
      </motion.button>
    </div>
  );
}
