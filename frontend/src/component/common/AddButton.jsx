// React imports
import React from "react";

// Icon imports
import { BsPlusCircleFill } from "react-icons/bs";

const AddButtonIcon = (props) => {
  const { extra, disabled } = props;
  const clickHandler = (e) => {
    e.preventDefault();
    props.onClick();
  };
  return (
    <button
      disabled={disabled}
      className={`bg-[#F4F7FE] rounded-full p-1 hover:cursor-pointer ${
        disabled ? "disabled:cursor-not-allowed" : "disabled:cursor-pointer"
      }`}
      onClick={clickHandler}
    >
      <BsPlusCircleFill
        className={`${extra} bg-white rounded-full text-[#0B99FF] w-5 h-5`}
      />
    </button>
  );
};

export default AddButtonIcon;
