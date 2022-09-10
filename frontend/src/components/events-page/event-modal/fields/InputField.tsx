import { Input, Text } from "@chakra-ui/react";
import { EventModalFieldProps } from "../../../../types/EventModalFieldProps";
import { EventPalette } from "../../../../types/EventPalette";

interface InputFieldProps extends EventModalFieldProps {
  eventPalette: EventPalette;
  value: string;
  setValue: (value: string) => void;
}

const InputField = (inputFieldProps: InputFieldProps) => {
  const { isEditable, eventPalette, value, setValue } = inputFieldProps;

  if (isEditable) {
    return (
      <Input
        value={value}
        placeholder="Enter event name"
        onChange={(e) => setValue(e.target.value)}
        {...eventPalette.fieldStyles}
      />
    );
  } else {
    return (
      <Text
        color={eventPalette.fieldStyles.color}
      >
        {value}
      </Text>
    );
  }
};

export default InputField;
