import { InputGroup, InputLeftAddon, Input } from "@chakra-ui/react";
import { EventPalette } from "../../../../types/EventPalette";

interface LinkFieldProps {
  eventPalette: EventPalette;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
}

const LinkField = (linkFieldProps: LinkFieldProps) => {
  const { eventPalette, placeholder, value, setValue } = linkFieldProps;

  return (
    <InputGroup>
      <InputLeftAddon
        children="https://"
        {...eventPalette.addonStyles}
      />

      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        {...eventPalette.fieldStyles}
      />
    </InputGroup>
  );
};

export default LinkField;
