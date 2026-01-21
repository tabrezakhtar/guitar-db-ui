import { Link } from "react-router-dom";

function EquipmentTypeGrid({ isVisible }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto fade-in-bounce delay-400 ${isVisible ? 'visible' : ''}`}>
      <Link to="/gallery?type=guitar" className="bg-[#202b3d] rounded-lg p-6 gentle-hover">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <img
              src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759833181/guitar-outline-sm_vfinxb.png"
              alt="Guitar outline"
              className="w-16 h-16"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Guitars</h3>
          <p className="text-gray-400 text-sm">Electric guitars from all brands.</p>
        </div>
      </Link>
      <Link to="/gallery?type=amp" className="bg-[#202b3d] rounded-lg p-6 gentle-hover">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <img
              src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759833181/amp-outline-sm_svwske.png"
              alt="Amp outline"
              className="w-16 h-16"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Amps</h3>
          <p className="text-gray-400 text-sm">Amplifiers, whether vintage or modern, analogue or digital.</p>
        </div>
      </Link>
      <Link to="/gallery?type=accessory" className="bg-[#202b3d] rounded-lg p-6 gentle-hover">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <img
              src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759833180/mic-outline-sm_bbqskx.png"
              alt="Microphone outline"
              className="w-16 h-16"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Accessories</h3>
          <p className="text-gray-400 text-sm">Picks, strings, cases, and other musical accessories.</p>
        </div>
      </Link>
    </div>
  );
}

export default EquipmentTypeGrid;