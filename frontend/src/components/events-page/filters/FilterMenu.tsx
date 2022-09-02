import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuOptionGroup,
  MenuList,
  MenuItemOption,
  Text
} from "@chakra-ui/react";
import { SetStateAction } from "react";

type FilterMenuProps = {
  title: string;
  selectedCollection: any[];
} & ({
  children: JSX.Element[];
  collection?: never;
  setSelectedCollection?: never;
} | {
  children?: never;
  collection: any[];
  setSelectedCollection: React.Dispatch<SetStateAction<any[]>>;
})

const FilterMenu = (filterMenuProps: FilterMenuProps) => {
  const { title, collection, selectedCollection, setSelectedCollection, children } = filterMenuProps;

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        colorScheme="whiteAlpha"
        size="lg"
        fontSize="md"
        maxWidth="100%"
        height="100%"
        style={{
          padding: "8px 12px",
        }}
      >
        <Text
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          textAlign="start"
        >
          {
            `${title}: ${selectedCollection.length ? `(${ selectedCollection.length })` : ""}
          ${selectedCollection.length ? selectedCollection.join(', ') : "All"}`
          }
        </Text>
      </MenuButton>

      <MenuList
        maxHeight="50vh"
        overflow="scroll"
      >
        {children ||
          <MenuOptionGroup
            type="checkbox"
            title={title}
            value={selectedCollection}
            onChange={(selectedCollection) => setSelectedCollection(selectedCollection as string[])}
          >
            {collection.map((collectionItem, index) =>
              <MenuItemOption
                value={collectionItem}
                key={index}
              >
                {collectionItem}
              </MenuItemOption>
            )}
          </MenuOptionGroup>
        }
      </MenuList>
    </Menu >
  );
};

export default FilterMenu;
