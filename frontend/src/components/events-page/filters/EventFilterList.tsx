import { Flex, Switch, Box, Text, Heading } from "@chakra-ui/react";
import { SetStateAction } from "react";
import { COLORS } from "../../../styles/theme";
import { EventType, EVENT_TYPES } from "../../../types/EventType";
import { TreasureMap } from "../../../types/TreasureMap";
import NightClubFilters from "../event-types/night-club/NightClubFilters";
import RPVenueFilters from "../event-types/rp-venue/RPVenueFilters";
import TreasureMapsFilters from "../event-types/treasure-maps/TreasureMapsFilters";
import MapMenu from "./MapMenu";

const EVENT_TYPE_FILTERS_COMPONENTS = {
  [EVENT_TYPES.NIGHT_CLUB]: NightClubFilters,
  [EVENT_TYPES.RP_VENUE]: RPVenueFilters,
  [EVENT_TYPES.TREASURE_MAPS]: TreasureMapsFilters
};

export interface EventTypeFiltersProps {
  selectedEventType: EventType | null;
  selectedGenres: string[];
  adultOnly: boolean;
  treasureMaps: TreasureMap[];
  selectedTreasureMaps: TreasureMap[];
  setSelectedGenres: React.Dispatch<SetStateAction<string[]>>;
  setAdultOnly: React.Dispatch<SetStateAction<boolean>>;
  setSelectedTreasureMaps: React.Dispatch<SetStateAction<TreasureMap[]>>;
}

interface EventFilterListProps {
  onlyLiveEvents: boolean;
  selectedEventType: EventType | null;
  maps: string[];
  selectedMaps: string[];
  selectedGenres: string[];
  adultOnly: boolean;
  treasureMaps: TreasureMap[];
  selectedTreasureMaps: TreasureMap[]
  setOnlyLiveEvents: React.Dispatch<SetStateAction<boolean>>;
  setSelectedEventType: React.Dispatch<SetStateAction<EventType | null>>;
  setSelectedMaps: React.Dispatch<SetStateAction<string[]>>;
  setSelectedGenres: React.Dispatch<SetStateAction<string[]>>;
  setAdultOnly: React.Dispatch<SetStateAction<boolean>>;
  setSelectedTreasureMaps: React.Dispatch<SetStateAction<TreasureMap[]>>;
}

const EventFilterList = (eventFilterListProps: EventFilterListProps) => {
  const {
    onlyLiveEvents,
    selectedEventType,
    maps,
    selectedMaps,
    selectedGenres,
    adultOnly,
    treasureMaps,
    selectedTreasureMaps,
    setOnlyLiveEvents,
    setSelectedMaps,
    setSelectedGenres,
    setAdultOnly,
    setSelectedTreasureMaps,
  } = eventFilterListProps;

  const EventTypeFilters = selectedEventType ? EVENT_TYPE_FILTERS_COMPONENTS[selectedEventType] : null;

  return (
    <Flex direction="column">
      <Heading
        size="md"
        color={COLORS.WHITE}
      >
        Filters
      </Heading>

      <Flex
        mt={{
          base: 2,
          sm: 3
        }}
        direction="column"
        maxWidth="100%"
      >
        <Flex
          direction="row"
          alignItems="center"
        >
          <Text
            color={COLORS.WHITE}
          >
            Live events only
          </Text>

          <Switch
            ml={{
              base: 2,
              sm: 3
            }}
            isChecked={onlyLiveEvents}
            onChange={(e) => setOnlyLiveEvents(e.target.checked)}
            colorScheme="whiteAlpha"
          />
        </Flex>

        {maps &&
          <Box
            mt={{
              base: 2,
              sm: 3
            }}
          >
            <MapMenu
              maps={maps}
              selectedMaps={selectedMaps}
              setSelectedMaps={setSelectedMaps}
            />
          </Box>
        }

        <Heading
          mt={6}
          size="md"
          color={COLORS.WHITE}
        >
          {`${selectedEventType ? selectedEventType : "Event type"} filters`}
        </Heading>

        <Box
          mt={{
            base: 2,
            sm: 3
          }}
        >
          {EventTypeFilters ?
            <EventTypeFilters
              selectedEventType={selectedEventType}
              selectedGenres={selectedGenres}
              adultOnly={adultOnly}
              setAdultOnly={setAdultOnly}
              treasureMaps={treasureMaps}
              selectedTreasureMaps={selectedTreasureMaps}
              setSelectedGenres={setSelectedGenres}
              setSelectedTreasureMaps={setSelectedTreasureMaps}
            />
            :
            <Text
              color={COLORS.WHITE}
            >
              {selectedEventType ? `No filters for ${selectedEventType}` : "Select an event type to see event type specific filters"}
            </Text>
          }
        </Box>
      </Flex>
    </Flex >
  );
}

export default EventFilterList;
