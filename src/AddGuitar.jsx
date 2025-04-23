import { useState } from "react";
import EditGuitar from "./EditGuitar";

function AddGuitar() {
  const [equipType, setEquipType] = useState("guitar");

  function toSentenceCase(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className="max-w-screen-md mx-auto p-6">
      <div className="flex justify-center gap-6 mb-6">
        <button onClick={()=>setEquipType("guitar")} className="flex flex-col items-center bg-gray-200 rounded-md p-4 hover:bg-gray-300 cursor-pointer">
          <img src="/guitar.png" alt="Guitar" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium">Guitar</span>
        </button>
        <button onClick={()=>setEquipType("amp")} className="flex flex-col items-center bg-gray-200 rounded-md p-4 hover:bg-gray-300 cursor-pointer">
          <img src="/amp.png" alt="Amp" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium">Amp</span>
        </button>
        <button onClick={()=>setEquipType("pedal")} className="flex flex-col items-center bg-gray-200 rounded-md p-4 hover:bg-gray-300 cursor-pointer">
          <img src="/pedal.png" alt="Pedal" className="w-24 h-24 mb-2" />
          <span className="text-sm font-medium">Pedal</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Add New {toSentenceCase(equipType)}</h1>
      <EditGuitar mode="add" type={equipType} />
    </div>
  );
}

export default AddGuitar;