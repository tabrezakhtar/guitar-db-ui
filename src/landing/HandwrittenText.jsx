import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";

function HandwrittenText({ text, className, delay = 0, isVisible, speed = 50 }) {
  const shouldReduceMotion = useReducedMotion();
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setDisplayedText("");
      setCurrentIndex(0);
      return;
    }

    if (speed === 0) {
      setDisplayedText(text);
      return;
    }

    const startDelay = setTimeout(() => {
      if (currentIndex < text.length) {
        const charDelay = setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);
        return () => clearTimeout(charDelay);
      }
    }, delay);

    return () => clearTimeout(startDelay);
  }, [currentIndex, text, delay, isVisible, speed]);

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
      {text.split(" ").map((word, wordIndex) => (
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
          {wordIndex < text.split(" ").length - 1 && <span style={{ display: "inline-block", width: "0.25em" }}> </span>}
        </span>
      ))}
    </motion.p>
  );
}

export default HandwrittenText;