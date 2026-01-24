import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

function EquipmentTypeGrid({ isVisible }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30, scale: isVisible ? 1 : 0.95 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.34, 1.56, 0.64, 1], delay: shouldReduceMotion ? 0 : 0.4 }}
    >
      <Link to="/gallery?type=guitar" className="bg-[#202b3d] rounded-lg p-6">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <motion.img
              src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759833181/guitar-outline-sm_vfinxb.png"
              alt="Guitar outline"
              className="w-16 h-16"
              whileHover={{ y: shouldReduceMotion ? 0 : -4 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeInOut" }}
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Guitars</h3>
          <p className="text-gray-400 text-sm">Electric guitars from all brands.</p>
        </div>
      </Link>
      <Link to="/gallery?type=amp" className="bg-[#202b3d] rounded-lg p-6">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <motion.img
              src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759833181/amp-outline-sm_svwske.png"
              alt="Amp outline"
              className="w-16 h-16"
              whileHover={{ y: shouldReduceMotion ? 0 : -4 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeInOut" }}
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Amps</h3>
          <p className="text-gray-400 text-sm">Amplifiers, whether vintage or modern, analogue or digital.</p>
        </div>
      </Link>
      <Link to="/gallery?type=accessory" className="bg-[#202b3d] rounded-lg p-6">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <motion.img
              src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759833180/mic-outline-sm_bbqskx.png"
              alt="Microphone outline"
              className="w-16 h-16"
              whileHover={{ y: shouldReduceMotion ? 0 : -4 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeInOut" }}
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Accessories</h3>
          <p className="text-gray-400 text-sm">Picks, strings, cases, and other musical accessories.</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default EquipmentTypeGrid;