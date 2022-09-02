import { InputGroup, InputLeftAddon, Input } from "@chakra-ui/react";
import { COLORS } from "../../../../styles/theme";

interface LinkFieldProps {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
}

const LinkField = (linkFieldProps: LinkFieldProps) => {
  const { placeholder, value, setValue } = linkFieldProps;

  return (
    < InputGroup>
      <InputLeftAddon children='https://' />

      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        focusBorderColor={COLORS.GREY_NORMAL}
      />
    </InputGroup>
  );
};

export default LinkField;
