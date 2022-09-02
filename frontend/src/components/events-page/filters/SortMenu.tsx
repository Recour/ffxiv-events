import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuDivider, MenuItemOption, MenuList, MenuOptionGroup } from "@chakra-ui/react"
import { SetStateAction } from "react";
import { EventField, EVENT_FIELDS } from "../../../database/events";

// SORT OPTIONS
export interface SortOption {
  text: string;
  value: EventField;
}

export const SORT_OPTIONS: { [key: string]: SortOption } = {
  NUMBER_OF_GUESTS: {
    text: "Number of guests",
    value: EVENT_FIELDS.COUNT_GUESTS
  },
  CREATION_DATE: {
    text: "Creation date",
    value: EVENT_FIELDS.CREATED_AT
  },
  START_TIME: {
    text: "Start time",
    value: EVENT_FIELDS.START_TIME
  },
  END_TIME: {
    text: "End time",
    value: EVENT_FIELDS.END_TIME
  }
};

// SORT ORDER
export const SORT_DIRECTIONS = {
  ASCENDING: "asc",
  DESCENDING: "desc"
};

export type SortDirection =
  | typeof SORT_DIRECTIONS.ASCENDING
  | typeof SORT_DIRECTIONS.DESCENDING;

export interface SortOrder {
  text: string;
  value: SortDirection;
}

export const SORT_ORDERS: { [key: string]: SortOrder } = {
  ASCENDING: {
    text: "Ascending",
    value: SORT_DIRECTIONS.ASCENDING
  },
  DESCENDING: {
    text: "Descending",
    value: SORT_DIRECTIONS.DESCENDING
  }
}

interface SortMenuProps {
  selectedSortOption: SortOption;
  selectedSortOrder: SortOrder;
  setSelectedSortOption: React.Dispatch<SetStateAction<SortOption>>;
  setSelectedSortOrder: React.Dispatch<SetStateAction<SortOrder>>;
}

const SortMenu = (sortMenuProps: SortMenuProps) => {
  const { selectedSortOption, selectedSortOrder, setSelectedSortOption, setSelectedSortOrder } = sortMenuProps;

  const onChangeSelectedSortOption: ((value: string) => void) = (sortOptionId) => {
    setSelectedSortOption(SORT_OPTIONS[sortOptionId]);
  };

  const onChangeSelectedSortOrder: ((value: string) => void) = (sortOrderId) => {
    setSelectedSortOrder(SORT_ORDERS[sortOrderId]);
  };

  return (
    <Menu closeOnSelect={false} placement="bottom-end">
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="whiteAlpha" size="sm">
        {`Sort on: ${selectedSortOption.text} (${selectedSortOrder.text})`}
      </MenuButton>

      <MenuList>
        <MenuOptionGroup
          type="radio"
          title="Sort by"
          value={Object.keys(SORT_OPTIONS).find(sortOptionId => SORT_OPTIONS[sortOptionId] === selectedSortOption)}
          onChange={(sortOptionId) => onChangeSelectedSortOption(sortOptionId as string)}
        >
          {Object.entries(SORT_OPTIONS).map(([sortOptionId, sortOption], index) =>
            <MenuItemOption
              value={sortOptionId}
              key={index}
            >
              {sortOption.text}
            </MenuItemOption>)
          }
        </MenuOptionGroup>

        <MenuDivider />

        <MenuOptionGroup
          type="radio"
          title="Order"
          defaultValue={Object.keys(SORT_ORDERS).find(sortOrderId => SORT_ORDERS[sortOrderId] === selectedSortOrder)}
          onChange={(sortOrderId) => onChangeSelectedSortOrder(sortOrderId as string)}
        >
          {Object.entries(SORT_ORDERS).map(([sortOrderId, sortOrder], index) =>
            <MenuItemOption
              value={sortOrderId}
              key={index}
            >
              {sortOrder.text}
            </MenuItemOption>)
          }
        </MenuOptionGroup>
      </MenuList>
    </Menu >
  );
};

export default SortMenu;
