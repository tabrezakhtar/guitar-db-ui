import { motion, useReducedMotion } from "framer-motion";

function HandwrittenText({ text, className, delay = 0, isVisible, speed = 50 }) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion || speed === 0 ? 0 : speed / 1000,
        delayChildren: shouldReduceMotion || speed === 0 ? 0 : delay / 1000
      }
    }
  };

  const child = {
    hidden: shouldReduceMotion || speed === 0 ? { opacity: 0 } : { 
      opacity: 0, 
      y: 10,
      x: -2 
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: shouldReduceMotion || speed === 0 ? 0 : 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.p
      className={className}
      variants={container}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {words.map((word, wordIndex) => (
        <span key={`word-${wordIndex}`} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              variants={child}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && <span style={{ display: "inline-block", width: "0.25em" }}> </span>}
        </span>
      ))}
    </motion.p>
  );
}

export default HandwrittenText;