import { useContext } from "react";
import { GuitarContext } from "../context/GuitarContext";

function FormFields({ type, isUploading, currentEquipment, setCurrentEquipment }) {
  const { currentEquipment: contextEquipment, setCurrentEquipment: contextSetEquipment } = useContext(GuitarContext);
  
  const equipment = currentEquipment || contextEquipment;
  const setEquipment = setCurrentEquipment || contextSetEquipment;

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
          { value: "Offset", label: "Offset" },
          { value: "Semi-hollow", label: "Semi-hollow" },
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
        <div key={field.key} className="mb-4">
          <label className="block text-[var(--color-text-header)]">{field.label}:</label>
          {field.type === "text" || field.type === "number" ? (
            <input
              type={field.type}
              name={field.key}
              placeholder={field.placeholder}
              value={equipment?.[field.key] || ""}
              onChange={(e) =>
                setEquipment({
                  ...equipment,
                  [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                })
              }
              disabled={isUploading}
              className="border border-gray-600 p-2 rounded w-full bg-[var(--color-panel-bg)] text-[var(--color-text-header)] placeholder-gray-400"
            />
          ) : field.type === "radio" ? (
            <div className="flex gap-4">
              {field.options.map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-[var(--color-text-header)]">
                  <input
                    type="radio"
                    name={field.key}
                    value={option.value}
                    checked={equipment?.[field.key] === option.value}
                    onChange={(e) =>
                      setEquipment({
                        ...equipment,
                        [field.key]: e.target.value,
                      })
                    }
                    disabled={isUploading}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          ) : field.type === "select" ? (
            <select
              name={field.key}
              value={equipment?.[field.key] || ""}
              onChange={(e) =>
                setEquipment({
                  ...equipment,
                  [field.key]: e.target.value,
                })
              }
              disabled={isUploading}
              className="border border-gray-600 p-2 rounded w-full bg-[var(--color-panel-bg)] text-[var(--color-text-header)]"
            >
              <option value="">Select {field.label} (optional)</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      ))}
    </>
  );
}

export default FormFields;