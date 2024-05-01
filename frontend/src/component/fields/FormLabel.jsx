// React imports
import React from "react";

function FieldLabel({ children, className }) {
  return (
    <label
      className={`block break-words capitalize text-gray-11 text-lg font-normal ${className}`}
    >
      {children}
    </label>
  );
}

export default FieldLabel;
