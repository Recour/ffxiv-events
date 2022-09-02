import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import { COLORS } from "../../../../styles/theme";
import { GENRES } from "../../../../types/Genre";
import { EventTypeFiltersProps } from "../../filters/EventFilterList";
import FilterMenu from "../../filters/FilterMenu";

const AllEventsFilters = (allEventsFiltersProps: EventTypeFiltersProps) => {
  const { selectedGenres, adultOnly, treasureMaps, selectedTreasureMaps, setSelectedGenres, setAdultOnly, setSelectedTreasureMaps } = allEventsFiltersProps;

  const genres = Object.values(GENRES);

  return (
    <Flex direction="column">
      <Flex
        direction="row"
        alignItems="center"
      >
        <Text
          color={COLORS.WHITE}
        >
          Adult only
        </Text>

        <Switch
          ml={{
            base: 2,
            sm: 3
          }}
          isChecked={adultOnly}
          onChange={(e) => setAdultOnly(e.target.checked)}
          colorScheme="whiteAlpha"
        />
      </Flex>

      <Box
        mt={{
          base: 2,
          sm: 3
        }}
      >
        <FilterMenu
          title="Genres"
          collection={genres}
          selectedCollection={selectedGenres}
          setSelectedCollection={setSelectedGenres}
        />
      </Box>

      <Flex
        mt={{
          base: 2,
          sm: 3
        }}
      >
        <FilterMenu
          title="Treasure maps"
          collection={treasureMaps}
          selectedCollection={selectedTreasureMaps}
          setSelectedCollection={setSelectedTreasureMaps}
        />
      </Flex>
    </Flex>
  );
}

export default AllEventsFilters;
