import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === "button" ||
        e.target.tagName.toLowerCase() === "input" ||
        e.target.tagName.toLowerCase() === "textarea" ||
        e.target.tagName.toLowerCase() === "select" ||
        e.target.tagName.toLowerCase() === "option" ||
        e.target.closest("button") ||
        e.target.closest("input") ||
        e.target.closest("textarea") ||
        e.target.closest("select") ||
        e.target.closest("option") ||
        e.target.tagName.toLowerCase() === "a" ||
        e.target.closest("a")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
    },
    hover: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 2.5,
      backgroundColor: "rgba(0, 0, 0, 0)",
      border: "1px solid rgba(99, 102, 241, 0.8)",
    },
  };

  return (
    <motion.div
      variants={variants}
      animate={isHovering ? "hover" : "default"}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        border: "2px solid var(--primary)",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "difference",
      }}
    />
  );
};
