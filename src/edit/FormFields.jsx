import { useContext } from "react";
import { GuitarContext } from "../context/GuitarContext";
import Select from "../components/Select";

function FormFields({ type, isUploading }) {
  const { currentEquipment, setCurrentEquipment } = useContext(GuitarContext);

  const fieldMapping = {
    guitar: [
      {
        label: "Shape",
        key: "shape",
        type: "select",
        options: [
          { value: "S Style", label: "S Style" },
          { value: "Double Cut", label: "Double Cut" },
          { value: "Single Cut", label: "Single Cut" },
          { value: "T Style", label: "T Style" },
          { value: "Semi-Acoustic", label: "Semi-Acoustic" },
          { value: "Modern", label: "Modern" },
          { value: "Headless", label: "Headless" },
          { value: "V Style", label: "V Style" },
        ],
      },
    ],
    amp: [
      {
        label: "Amp Type",
        key: "ampType",
        type: "radio",
        options: [
          { value: "Digital", label: "Digital" },
          { value: "Tube", label: "Tube" },
        ],
      },
    ],
    pedal: [
      { label: "Effect Type", key: "effectType", type: "text", placeholder: "Enter the effect type of the pedal" },
    ],
  };

  return (
    <>
      {fieldMapping[type]?.map((field) => (
        <div key={field.key}>
          <label className="block text-black dark:text-white">{field.label}:</label>
          {field.type === "text" || field.type === "number" ? (
            <input
              type={field.type}
              name={field.key}
              placeholder={field.placeholder}
              value={currentEquipment?.[field.key] || ""}
              onChange={(e) =>
                setCurrentEquipment({
                  ...currentEquipment,
                  [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                })
              }
              className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          ) : field.type === "radio" ? (
            <div className="flex gap-4">
              {field.options.map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-black dark:text-white">
                  <input
                    type="radio"
                    name={field.key}
                    value={option.value}
                    checked={currentEquipment?.[field.key] === option.value}
                    onChange={(e) =>
                      setCurrentEquipment({
                        ...currentEquipment,
                        [field.key]: e.target.value,
                      })
                    }
                  />
                  {option.label}
                </label>
              ))}
            </div>
          ) : field.type === "select" ? (
            <Select
              options={field.options}
              value={
                currentEquipment?.[field.key]
                  ? field.options.find((option) => option.value === currentEquipment[field.key])
                  : null
              }
              onChange={(selected) =>
                setCurrentEquipment({
                  ...currentEquipment,
                  [field.key]: selected?.value || "",
                })
              }
              isClearable
              isDisabled={isUploading}
            />
          ) : null}
        </div>
      ))}
    </>
  );
}

export default FormFields;