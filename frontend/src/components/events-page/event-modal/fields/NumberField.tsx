import { Flex, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from "@chakra-ui/react";
import { EventModalFieldProps } from "../../../../types/EventModalFieldProps";
import { EventPalette } from "../../../../types/EventPalette";

interface NumberFieldProps extends EventModalFieldProps {
  eventPalette: EventPalette;
  label: string;
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
}

const NumberField = (numberFieldProps: NumberFieldProps) => {
  const { isEditable, eventPalette, label, value, setValue, min, max } = numberFieldProps;

  if (isEditable) {
    return (
      < Flex
        direction="row"
        alignItems="center"
      >
        <Text
          {...eventPalette.fieldStyles}
        >
          {label}:
        </Text>

        <NumberInput
          value={value}
          min={min}
          max={max}
          size="sm"
          ml={2}
          onChange={(valueAsString, valueAsNumber) => {
            if (valueAsNumber) {
              setValue(valueAsNumber);
            }
          }}
          {...eventPalette.fieldStyles}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex >
    );
  } else {
    return (
      <Text>
        {label} {value}
      </Text>
    );
  }
};

export default NumberField;
