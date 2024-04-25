// React imports
import React from "react";

// Icon imports
import { BsPencilSquare } from "react-icons/bs";
import PencilIcon from "../../assets/images/pencil.svg";

const EditButtonIcon = (props) => {
  const { extra } = props;
  return (
    <img
      src={PencilIcon}
      alt="PencilIcon"
      className={`${extra} w-4 h-4 hover:cursor-pointer`}
      onClick={props.onClick}
    />
  );
};

export default EditButtonIcon;
