import { Input, Text } from "@chakra-ui/react";
import { COLORS } from "../../../../styles/theme";
import { EventModalFieldProps } from "../../../../types/EventModalFieldProps";

interface InputFieldProps extends EventModalFieldProps {
  value: string;
  setValue: (value: string) => void;
}

const InputField = (inputFieldProps: InputFieldProps) => {
  const { isEditable, value, setValue } = inputFieldProps;

  if (isEditable) {
    return (
      <Input
        value={value}
        placeholder="Enter event name"
        focusBorderColor={COLORS.GREY_NORMAL}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  } else {
    return (
      <Text>
        {value}
      </Text>
    );
  }
};

export default InputField;
