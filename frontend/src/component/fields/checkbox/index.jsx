import { Checkbox } from "@mui/material";
import { useState } from "react";

const CustomCheckBox = (props) => {
  const { extra, ...rest } = props;
  console.log(rest, "sd")
  return (
    <Checkbox
      {...rest}
      className="!p-0 [&>svg]:h-5"
    />
  );
};

export default CustomCheckBox;
