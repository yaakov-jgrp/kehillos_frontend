// UI Imports
import { Checkbox } from "@mui/material";

const CustomCheckBox = (props) => {
  const { disabled, ...rest } = props;
  return (
    <Checkbox
      {...rest}
      disabled={disabled}
      style={{
        color: "#1C1C1C",
        "&:hover": {
          backgroundColor: "#1C1C1C",
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
