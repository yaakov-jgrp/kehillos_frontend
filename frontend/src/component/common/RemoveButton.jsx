// React imports
import React from "react";

// Icon imports
import { BsTrashFill } from "react-icons/bs";

const RemoveButtonIcon = (props) => {
  const { extra, disabled } = props;
  const clickHandler = (e) => {
    e.preventDefault();
    props.onClick();
  };
  return (
    <button 
      disabled={disabled} 
      className={`bg-[#F4F7FE] rounded-full p-1 hover:cursor-pointer ${disabled ? 'disabled:cursor-not-allowed' : 'disabled:cursor-pointer'}`} 
      onClick={clickHandler}
    >
      <BsTrashFill
        className={`${extra} bg-white rounded-full text-red-500 w-5 h-5`}
      />
    </button>
  );
};

export default RemoveButtonIcon;