import React, { useState } from "react";
// import "./customDraggable.css";

const CustomDraggable = ({ children, onPositionChange, style }) => {
  const [items, setItems] = useState(children);
  const [draggingIndex, setDraggingIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleDragEnter = (index) => {
    if (index !== draggingIndex) {
      const updatedItems = [...items];
      const [draggedItem] = updatedItems.splice(draggingIndex, 1);
      updatedItems.splice(index, 0, draggedItem);

      setDraggingIndex(index);
      setItems(updatedItems);

      if (onPositionChange) {
        onPositionChange(draggingIndex, index, draggedItem);
      }
    }
  };

  const handleDragEnd = () => {
    setDraggingIndex(null); // Reset dragging state
  };

  return (
    <div className="draggable-container flex flex-wrap">
      {items.map((item, index) => {
        const itemWidth = item.props?.style?.width;
        return(
        <div
          key={index}
          className={`draggable-item ${draggingIndex === index ? "dragging" : ""}`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          style={{
            ...style, // Existing styles
            width: `${itemWidth}%`, // Set the extracted width
          }}
        >
          {item}
        </div>
      )})}
    </div>
  );
};

export default CustomDraggable;
