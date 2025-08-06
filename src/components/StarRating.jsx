import { useState } from "react";

function StarRating({ rating = 0, onChange, disabled = false }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = (index) => {
    if (disabled) return;
    setIsHovering(true);
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setIsHovering(false);
    setHoverRating(0);
  };

  const handleClick = (index) => {
    if (disabled) return;
    onChange(index);
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
          className={`text-2xl cursor-${disabled ? "default" : "pointer"} transition-colors`}
          style={{ opacity: disabled ? 0.7 : 1 }}
        >
          {index <= (isHovering ? hoverRating : rating) ? (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="gold"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-600 dark:text-gray-300"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-600 dark:text-gray-300"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}

export default StarRating;