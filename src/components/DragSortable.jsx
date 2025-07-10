import { useState, useRef } from "react";

const DragSortable = ({ 
  list, 
  setList, 
  className = "", 
  dragClass = "", 
  ghostClass = "", 
  disabled = false,
  children 
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragCounter = useRef(0);

  const handleDragStart = (e, index) => {
    if (disabled) return;
    
    setDraggedItem(list[index]);
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (e) => {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, index) => {
    if (disabled) return;
    dragCounter.current++;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    if (disabled) return;
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    if (disabled) return;
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      handleDragEnd();
      return;
    }

    const newList = [...list];
    const draggedElement = newList[draggedIndex];
    
    // Remove the dragged element
    newList.splice(draggedIndex, 1);
    
    // Insert it at the new position
    newList.splice(dropIndex, 0, draggedElement);
    
    setList(newList);
    handleDragEnd();
  };

  const getItemClassName = (index) => {
    let itemClass = "";
    
    if (draggedIndex === index) {
      itemClass += ` ${dragClass}`;
    }
    
    if (dragOverIndex === index && draggedIndex !== index) {
      itemClass += ` ${ghostClass}`;
    }
    
    return itemClass.trim();
  };

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          draggable={!disabled}
          className={getItemClassName(index)}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          style={{
            cursor: disabled ? "default" : "move",
            opacity: draggedIndex === index ? 0.5 : 1
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default DragSortable;
