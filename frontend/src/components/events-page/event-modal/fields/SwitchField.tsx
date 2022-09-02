import { Flex, Switch, Text } from "@chakra-ui/react";

interface SwitchFieldProps {
  label: string;
  value: boolean;
  setValue: (value: boolean) => void;
}

const SwitchField = (switchFieldProps: SwitchFieldProps) => {
  const { label, value, setValue } = switchFieldProps;

  return (
    <Flex direction="row" alignItems="center">
      <Text>
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
