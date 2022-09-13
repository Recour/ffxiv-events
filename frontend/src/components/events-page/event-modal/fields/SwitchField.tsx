import { Flex, Switch, Text } from "@chakra-ui/react";

interface SwitchFieldProps {
  label: string;
  value: boolean;
  setValue: (value: boolean) => void;
  color?: string;
  colorScheme?: string;
}

const SwitchField = (switchFieldProps: SwitchFieldProps) => {
  const { label, value, setValue, color, colorScheme } = switchFieldProps;

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
        colorScheme={colorScheme}
      >
      </Switch>
    </Flex>
  );
};

export default SwitchField;
