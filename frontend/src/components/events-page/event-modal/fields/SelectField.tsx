import { Flex, Icon, Select, Text } from "@chakra-ui/react";
import { IconType } from "@react-icons/all-files";
import { EventModalFieldProps } from "../../../../types/EventModalFieldProps";
import { EventPalette } from "../../../../types/EventPalette";

interface SelectFieldProps extends EventModalFieldProps {
  eventPalette: EventPalette;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  children: JSX.Element | JSX.Element[];
  icon: IconType;
}

const SelectField = (selectFieldProps: SelectFieldProps) => {
  const { isEditable, eventPalette, placeholder, value, setValue, children, icon } = selectFieldProps;

  if (isEditable) {
    return (
      <Select
        width="100%"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        {...eventPalette.fieldStyles}
        {...{ color: !value ? eventPalette.fieldStyles._placeholder.color : eventPalette.fieldStyles.color }}
      >
        {children}
      </Select >
    );
  } else {
    return (
      <Flex
        direction="row"
        alignItems="center"
        color={eventPalette.fieldStyles.color}
      >
        <Icon as={icon} mr={1} />

        <Text fontSize="sm">
          {value}
        </Text>
      </Flex>
    );
  }
};

export default SelectField;
