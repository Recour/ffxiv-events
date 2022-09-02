import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Tag
} from "@chakra-ui/react";
import { GENRES } from "../../../../types/Genre";
import { EventTypeInfoProps } from "../EventTypeInfo";

const NightClubInfo = (nightClubInfoProps: EventTypeInfoProps) => {
  const { isEditable, formState, setFormState } = nightClubInfoProps;

  const genres = Object.values(GENRES);

  return (
    <>
      {isEditable ?
        <>
          {/* GENRES */}
          < Box mt={3}>
            <Menu closeOnSelect={false}>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                size="sm"
              >
                {`Genres: ${formState.genres.length ? formState.genres.join(', ') : "None"}`}
              </MenuButton>

              <MenuList
                maxHeight="50vh"
                overflow="scroll"
              >
                <MenuOptionGroup
                  type="checkbox"
                  title="Genres"
                  value={formState.genres}
                  onChange={(selectedGenres) => {
                    setFormState((formState) => {
                      return {
                        ...formState,
                        genres: selectedGenres ? selectedGenres as string[] : []
                      };
                    });
                  }}
                >
                  {genres.map((genre, index) =>
                    <MenuItemOption
                      value={genre}
                      key={index}
                    >
                      {genre}
                    </MenuItemOption>
                  )}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </Box>
        </>
        :
        <Flex direction="row" alignItems="flex-start">
          {formState.genres.length ?
            formState.genres.map((genre, index) =>
              <Tag
                colorScheme="purple"
                ml={index > 0 ? 1 : 0}
                key={index}
              >
                {genre}
              </Tag>
            )
            :
            <Tag>No genres</Tag>
          }
        </Flex>
      }
    </>
  )
}

export default NightClubInfo;
