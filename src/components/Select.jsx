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
        ? "var(--color-index-bg)" 
        : state.isFocused 
        ? "var(--color-card-dark-hover)" 
        : "var(--color-card-dark)",
      color: "var(--color-text-header)",
      padding: "8px 12px"
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#f3f4f6"
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "var(--color-card-dark)",
      borderRadius: "4px",
      border: "1px solid var(--color-skeleton-line)"
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "var(--color-text-header)",
      padding: "2px 6px"
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

  return (
    <ReactSelect
      className={`react-select-container ${className}`}
      classNamePrefix="react-select"
      styles={darkModeStyles}
      {...props}
    />
  );
}

export default Select;
