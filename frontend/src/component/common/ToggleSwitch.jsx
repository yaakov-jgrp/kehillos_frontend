// React imports
import React, { useEffect, useState } from "react";

const ToggleSwitch = ({ selected, clickHandler }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(selected);
  }, [selected]);

  const handleChange = (e) => {
    if (clickHandler) {
      clickHandler(e);
    }
    setChecked(e.target.checked);
  };

  return (
    <label
      className={`relative inline-flex items-center h-[18px] rounded-full w-9 transition-colors focus:outline-none border-[2.5px] ${
        checked ? "border-[#0B99FF]" : "border-[#E3E5E6]"
      }`}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={handleChange}
      />
      <span
        className={`${
          checked ? "translate-x-[19px]" : "translate-x-1"
        } inline-block -mt-0.4 w-[10px] h-[10px] transform ${
          checked ? "bg-[#0B99FF]" : "bg-[#E3E5E6]"
        } rounded-full transition-transform`}
      />
    </label>
  );
};

export default ToggleSwitch;
