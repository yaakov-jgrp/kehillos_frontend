// UI Imports
import { Checkbox } from "@mui/material";

const CustomCheckBox = (props) => {
  const { disabled, ...rest } = props;
  return (
    <Checkbox
      {...rest}
      disabled={disabled}
      style={{
        color: "#0B99FF",
        "&:hover": {
          backgroundColor: "#0B99FF",
        },
        "& .MuiSvgIcon-root": {
          color: "white",
        },
        "& .Mui-checked": {
          color: "white",
        },
      }}
    />
  );
};

export default CustomCheckBox;
