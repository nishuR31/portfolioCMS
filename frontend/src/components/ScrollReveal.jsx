import React from "react";
import { motion } from "framer-motion";

export const ScrollReveal = ({ children, className = "", delay = 0 }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};
