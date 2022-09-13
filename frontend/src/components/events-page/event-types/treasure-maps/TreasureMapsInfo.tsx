import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Tag } from "@chakra-ui/react";
import { EventTypeInfoProps } from "../EventTypeInfo";

const TreasureMapsInfo = (treasureMapsInfoProps: EventTypeInfoProps) => {
  const { eventPalette, isEditable, formState, setFormState, treasureMaps } = treasureMapsInfoProps;

  return (
    <Box>
      {isEditable ?
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            size="sm"
            {...eventPalette.nestedFieldStyles}
          >
            {`Treasure maps: ${formState.treasureMaps.length ? formState.treasureMaps.join(', ') : "None"}`}
          </MenuButton>

          <MenuList
            maxHeight="50vh"
            overflow="scroll"
          >
            <MenuOptionGroup
              type="checkbox"
              title="Treasure maps"
              value={formState.treasureMaps}
              onChange={(selectedTreasureMaps) => {
                setFormState((formState) => {
                  return {
                    ...formState,
                    treasureMaps: selectedTreasureMaps ? selectedTreasureMaps as string[] : []
                  };
                });
              }}
            >
              {treasureMaps.map((treasureMap, index) =>
                <MenuItemOption
                  value={treasureMap}
                  key={index}
                >
                  {treasureMap}
                </MenuItemOption>
              )}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
        :
        <Flex direction="row" alignItems="center">
          {formState.treasureMaps.length ?
            formState.treasureMaps.map((treasureMap, index) =>
              <Tag
                colorScheme="purple"
                ml={index > 0 ? 1 : 0}
                key={index}
              >
                {treasureMap}
              </Tag>
            )
            :
            <Tag>No treasure maps</Tag>
          }
        </Flex>
      }
    </Box>
  )
}

export default TreasureMapsInfo;
