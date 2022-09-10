import { Box, Flex } from "@chakra-ui/react";
import { COLORS } from "../../../../styles/theme";
import { GENRES } from "../../../../types/Genre";
import SwitchField from "../../event-modal/fields/SwitchField";
import { EventTypeFiltersProps } from "../../filters/EventFilterList";
import FilterMenu from "../../filters/FilterMenu";

const AllEventsFilters = (allEventsFiltersProps: EventTypeFiltersProps) => {
  const { selectedGenres, adultOnly, treasureMaps, selectedTreasureMaps, setSelectedGenres, setAdultOnly, setSelectedTreasureMaps } = allEventsFiltersProps;

  const genres = Object.values(GENRES);

  return (
    <Flex direction="column">
      <SwitchField
        label={"Adult only"}
        value={adultOnly}
        setValue={(value: boolean) => setAdultOnly(value)}
        color={COLORS.WHITE}
        colorScheme="blackAlpha"
      />

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
