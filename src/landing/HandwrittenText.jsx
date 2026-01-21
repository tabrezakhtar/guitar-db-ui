import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function HandwrittenText({ text, className, delay = 0, isVisible, speed = 50 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setDisplayedText("");
      setCurrentIndex(0);
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
        staggerChildren: speed / 1000,
        delayChildren: delay / 1000
      }
    }
  };

  const child = {
    hidden: { 
      opacity: 0, 
      y: 10,
      x: -2 
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.3,
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
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={child}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
}

export default HandwrittenText;