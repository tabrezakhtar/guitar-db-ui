import { useState } from "react";
import PropTypes from "prop-types";

function Tag({ tag, selected = false, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const tagColor = tag.colour || "#6b7280";
  const textColor = isLightColor(tagColor) ? "#000000" : "#ffffff";
  
  const handleClick = () => {
    if (onClick) {
      onClick(tag);
    }
  };
  
  return (
    <span 
      className={`inline-flex items-center px-3 py-1.5 rounded-sm m-1 transition-transform duration-100 hover:scale-105 relative text-xs cursor-pointer ${selected ? "ring-2 ring-offset-1" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ 
        backgroundColor: tagColor,
        color: textColor,
        filter: isHovered ? "brightness(1.1)" : "none",
        paddingLeft: "24px",
        transform: selected ? "scale(1.05)" : "none",
        ringColor: selected ? "#2563eb" : "transparent"
      }}
    >
      <span 
        className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full"
        style={{
          width: "8px",
          height: "8px",
          backgroundColor: selected 
            ? "#2563eb" // Bright blue when selected
            : isLightColor(tagColor) ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)"
        }}
      ></span>
      {tag.icon && <span className="mr-1">{tag.icon}</span>}
      {tag.name}
    </span>
  );
}

function isLightColor(color) {
  let r, g, b;
  
  if (color.startsWith("#")) {
    const hex = color.substring(1);
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (color.startsWith("rgb")) {
    const rgbValues = color.match(/\d+/g);
    if (rgbValues && rgbValues.length >= 3) {
      r = parseInt(rgbValues[0]);
      g = parseInt(rgbValues[1]);
      b = parseInt(rgbValues[2]);
    } else {
      return false;
    }
  } else {
    return false;
  }
  
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128;
}

Tag.propTypes = {
  tag: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    colour: PropTypes.string
  }).isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func
};

export default Tag;