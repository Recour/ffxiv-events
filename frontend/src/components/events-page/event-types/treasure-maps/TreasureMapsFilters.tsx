import { Flex } from "@chakra-ui/react";
import { EventTypeFiltersProps } from "../../filters/EventFilterList";
import FilterMenu from "../../filters/FilterMenu";

const TreasureMapsFilters = (treasureMapsFilters: EventTypeFiltersProps) => {
  const { treasureMaps, selectedTreasureMaps, setSelectedTreasureMaps } = treasureMapsFilters;

  return (
    <Flex direction="column">
      <Flex>
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

export default TreasureMapsFilters;
