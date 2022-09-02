import { Flex, Icon, Select, Text } from "@chakra-ui/react";
import { IconType } from "@react-icons/all-files";
import { EventModalFieldProps } from "../../../../types/EventModalFieldProps";

interface SelectFieldProps extends EventModalFieldProps {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  children: JSX.Element | JSX.Element[];
  icon: IconType;
}

const SelectField = (selectFieldProps: SelectFieldProps) => {
  const { isEditable, placeholder, value, setValue, children, icon } = selectFieldProps;

  if (isEditable) {
    return (
      <Select
        width="100%"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        className={!value ? "chakra-select__placeholder" : ""}
      >
        {children}
      </Select>
    );
  } else {
    return (
      <Flex direction="row" alignItems="center">
        <Icon as={icon} mr={1} />

        <Text fontSize="sm">
          {value}
        </Text>
      </Flex>
    );
  }
};

export default SelectField;
