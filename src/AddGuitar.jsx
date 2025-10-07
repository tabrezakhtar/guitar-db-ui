import { useState } from "react";
import EditGuitar from "./edit/EditGuitar";
import Breadcrumbs from "./components/Breadcrumbs";

function AddGuitar() {
  const [equipType, setEquipType] = useState("guitar");

  function toSentenceCase(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

    const breadcrumbItems = [
    {
      label: equipType ? "Adding " + equipType?.charAt(0).toUpperCase() + equipType?.slice(1) : "Equipment",
      url: "/"
    },
  ];

  return (
    <div className="max-w-screen-md mx-auto p-6 bg-white dark:bg-[#122634]">
      <div className="mb-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Add New {toSentenceCase(equipType)}</h1>
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        <button
          onClick={() => setEquipType("guitar")}
          className={`flex flex-col items-center bg-gray-200 dark:bg-gray-700 rounded-md p-4 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-colors ${equipType === "guitar" ? "outline-3 outline-blue-500 dark:outline-blue-400" : ""}`}
        >
          <img src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857213/vintage-semi1_r7n1vj.png" alt="Guitar" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium text-black dark:text-white">Guitar</span>
        </button>
        <button
          onClick={() => setEquipType("bass")}
          className={`flex flex-col items-center bg-gray-200 dark:bg-gray-700 rounded-md p-4 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-colors ${equipType === "bass" ? "outline-3 outline-blue-500 dark:outline-blue-400" : ""}`}
        >
          <img src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857214/vintage-bass1_rzpl8q.png" alt="Bass" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium text-black dark:text-white">Bass</span>
        </button>
        <button
          onClick={() => setEquipType("acoustic")}
          className={`flex flex-col items-center bg-gray-200 dark:bg-gray-700 rounded-md p-4 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-colors ${equipType === "acoustic" ? "outline-3 outline-blue-500 dark:outline-blue-400" : ""}`}
        >
          <img src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857213/acoustic1_o9agae.png" alt="Acoustic" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium text-black dark:text-white">Acoustic</span>
        </button>
        <button
          onClick={() => setEquipType("amp")}
          className={`flex flex-col items-center bg-gray-200 dark:bg-gray-700 rounded-md p-4 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-colors ${equipType === "amp" ? "outline-3 outline-blue-500 dark:outline-blue-400" : ""}`}
        >
          <img src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857212/marshall1_e6ddzm.png" alt="Amp" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium text-black dark:text-white">Amp</span>
        </button>
        <button
          onClick={() => setEquipType("pedal")}
          className={`flex flex-col items-center bg-gray-200 dark:bg-gray-700 rounded-md p-4 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-colors ${equipType === "pedal" ? "outline-3 outline-blue-500 dark:outline-blue-400" : ""}`}
        >
          <img src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857212/boss-ds1_qcqsiz.png" alt="Pedal" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium text-black dark:text-white">Pedal</span>
        </button>
        <button
          onClick={() => setEquipType("accessory")}
          className={`flex flex-col items-center bg-gray-200 dark:bg-gray-700 rounded-md p-4 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-colors ${equipType === "accessory" ? "outline-3 outline-blue-500 dark:outline-blue-400" : ""}`}
        >
          <img src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857214/mic_e4e0ec.png" alt="Accessories" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium text-black dark:text-white">Accessory / Parts</span>
        </button>
      </div>

      <EditGuitar mode="add" type={equipType} />
    </div>
  );
}

export default AddGuitar;