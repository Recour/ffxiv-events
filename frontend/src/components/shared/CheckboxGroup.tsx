import { Box, Checkbox, Stack } from "@chakra-ui/react";
import { ChangeEvent } from "react";

export interface CheckboxItem {
  id: number;
  name: string;
}

interface CheckboxGroupProps {
  items: CheckboxItem[];
  selectedItems: number[];
  parentCheckboxLabel: string;
  isDisabled: boolean;
  onChangeParentCheckbox: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeChildCheckbox: (event: ChangeEvent<HTMLInputElement>, itemId: number) => void;
}

const CheckboxGroup = (checkboxGroupProps: CheckboxGroupProps) => {
  const {
    items,
    selectedItems,
    parentCheckboxLabel,
    isDisabled,
    onChangeParentCheckbox,
    onChangeChildCheckbox,
  } = checkboxGroupProps;

  const allChecked = items.every(item => selectedItems.includes(item.id));
  const isIndeterminate = items.some(item => selectedItems.includes(item.id)) && !allChecked;

  return (
    <>
      <Checkbox
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        isDisabled={isDisabled}
        onChange={onChangeParentCheckbox}
      >
        <Box
          fontWeight="bold"
        >
          {parentCheckboxLabel}
        </Box>
      </Checkbox>

      <Stack pl={6} mt={1} spacing={1}>
        {items.map((item, index) => (
          <Checkbox
            isChecked={selectedItems.includes(item.id)}
            onChange={(e) => onChangeChildCheckbox(e, item.id)}
            isDisabled={isDisabled}
            key={index}
          >
            {item.name}
          </Checkbox>
        ))}
      </Stack>
    </>
  )

}

export default CheckboxGroup;
