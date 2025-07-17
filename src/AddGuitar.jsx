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
    <div className="max-w-screen-md mx-auto p-6 bg-white">
      <div className="mb-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <h1 className="text-2xl font-bold mb-4">Add New {toSentenceCase(equipType)}</h1>
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        <button
          onClick={() => setEquipType("guitar")}
          className={`flex flex-col items-center bg-gray-200 rounded-md p-4 hover:bg-gray-300 cursor-pointer ${equipType === "guitar" ? "outline-3 outline-blue-500" : ""}`}
        >
          <img src="/guitar.png" alt="Guitar" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium">Guitar</span>
        </button>
        <button
          onClick={() => setEquipType("bass")}
          className={`flex flex-col items-center bg-gray-200 rounded-md p-4 hover:bg-gray-300 cursor-pointer ${equipType === "bass" ? "outline-3 outline-blue-500" : ""}`}
        >
          <img src="/bass.png" alt="Bass" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium">Bass</span>
        </button>
        <button
          onClick={() => setEquipType("acoustic")}
          className={`flex flex-col items-center bg-gray-200 rounded-md p-4 hover:bg-gray-300 cursor-pointer ${equipType === "acoustic" ? "outline-3 outline-blue-500" : ""}`}
        >
          <img src="/acoustic.png" alt="Acoustic" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium">Acoustic</span>
        </button>
        <button
          onClick={() => setEquipType("amp")}
          className={`flex flex-col items-center bg-gray-200 rounded-md p-4 hover:bg-gray-300 cursor-pointer ${equipType === "amp" ? "outline-3 outline-blue-500" : ""}`}
        >
          <img src="/amp.png" alt="Amp" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium">Amp</span>
        </button>
        <button
          onClick={() => setEquipType("pedal")}
          className={`flex flex-col items-center bg-gray-200 rounded-md p-4 hover:bg-gray-300 cursor-pointer ${equipType === "pedal" ? "outline-3 outline-blue-500" : ""}`}
        >
          <img src="/pedal.png" alt="Pedal" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium">Pedal</span>
        </button>
        <button
          onClick={() => setEquipType("accessory")}
          className={`flex flex-col items-center bg-gray-200 rounded-md p-4 hover:bg-gray-300 cursor-pointer ${equipType === "accessory" ? "outline-3 outline-blue-500" : ""}`}
        >
          <img src="/accessory.png" alt="Accessory / Parts" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium">Accessory / Parts</span>
        </button>
      </div>

      <EditGuitar mode="add" type={equipType} />
    </div>
  );
}

export default AddGuitar;