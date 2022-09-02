import { Box, Flex } from "@chakra-ui/react";
import { GENRES } from "../../../../types/Genre";
import { EventTypeFiltersProps } from "../../filters/EventFilterList";
import FilterMenu from "../../filters/FilterMenu";

const NightClubFilters = (nightClubFiltersProps: EventTypeFiltersProps) => {
  const { selectedGenres, setSelectedGenres } = nightClubFiltersProps;

  const genres = Object.values(GENRES);

  return (
    <Flex direction="column">
      <Box>
        <FilterMenu
          title="Genres"
          collection={genres}
          selectedCollection={selectedGenres}
          setSelectedCollection={setSelectedGenres}
        />
      </Box>
    </Flex>
  );
}

export default NightClubFilters;
