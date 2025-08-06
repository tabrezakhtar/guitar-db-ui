import ReactSelect from "react-select";

function Select({ className = "", ...props }) {
  const darkModeStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "var(--tw-bg-opacity) && rgb(55 65 81 / var(--tw-bg-opacity))",
      borderColor: state.isFocused ? "#3b82f6" : "#4b5563",
      color: "#f3f4f6",
      "&:hover": {
        borderColor: "#6b7280"
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#374151",
      border: "1px solid #4b5563"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? "#3b82f6" 
        : state.isFocused 
        ? "#4b5563" 
        : "transparent",
      color: "#f3f4f6"
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#f3f4f6"
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#4b5563"
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#f3f4f6"
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#f3f4f6",
      "&:hover": {
        backgroundColor: "#ef4444",
        color: "#ffffff"
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af"
    }),
    input: (provided) => ({
      ...provided,
      color: "#f3f4f6"
    })
  };

  const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <ReactSelect
      className={`react-select-container ${className}`}
      classNamePrefix="react-select"
      styles={isDarkMode ? darkModeStyles : undefined}
      {...props}
    />
  );
}

export default Select;
