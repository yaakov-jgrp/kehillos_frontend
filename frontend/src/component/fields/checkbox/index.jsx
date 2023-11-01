import { Checkbox } from "@chakra-ui/react";

const CustomCheckBox = (props) => {
  const { extra, ...rest } = props;
  return (
    <Checkbox
      {...rest}
      colorScheme="custom"
      _checked={{ bg: "#422AFB", borderColor: "#422AFB", height: "fit-content" }} />
  );
};

export default CustomCheckBox;
