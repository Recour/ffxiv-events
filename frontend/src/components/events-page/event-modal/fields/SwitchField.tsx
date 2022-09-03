import { Flex, Switch, Text } from "@chakra-ui/react";

interface SwitchFieldProps {
  label: string;
  value: boolean;
  setValue: (value: boolean) => void;
  color?: string;
}

const SwitchField = (switchFieldProps: SwitchFieldProps) => {
  const { label, value, setValue, color } = switchFieldProps;

  return (
    <Flex direction="row" alignItems="center">
      <Text
        color={color}
      >
        {label}
      </Text>

      <Switch
        ml={2}
        isChecked={value}
        onChange={() => setValue(!value)}
        colorScheme="blackAlpha"
      >
      </Switch>
    </Flex>
  );
};

export default SwitchField;
