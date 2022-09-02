import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Hide,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Show,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect, Dispatch, SetStateAction, useCallback } from "react";
import { DataCenter } from "../../types/DataCenter";
import EventsGrid from "./EventsGrid";
import SortMenu, { SortOption, SortOrder, SORT_OPTIONS, SORT_ORDERS } from "./filters/SortMenu";
import { Outlet, useMatch } from "react-router-dom";
import { WorldServer } from "../../types/WorldServer";
import { Event } from "../../types/Event";
import { COLORS } from "../../styles/theme";
import { EventType, EVENT_TYPES, EVENT_TYPES_TO_ARTICLES } from "../../types/EventType";
import { EventFilters, EVENT_FIELDS, getEvents } from "../../database/events";
import EventFilterList from "./filters/EventFilterList";
import { TreasureMap } from "../../types/TreasureMap";
import { usePrevious } from "../../helpers/usePrevious";
import { ROUTES } from "../../consts/routes";
import { MdFilterList } from "@react-icons/all-files/md/MdFilterList";
import EventTypeSelect from "./filters/EventTypeSelect";
import ServerMenu from "./filters/ServerMenu";
import axios from "axios";
import { FfxivRpEvent, transformFfxivRpEvent } from "../../ffxiv-rp/ffxiv-rp";

const EVENT_PAGE_LIMIT = 25;

interface EventPageProps {
  dataCenters: DataCenter[];
  maps: string[];
  worldServers: WorldServer[];
  treasureMaps: TreasureMap[];
  setDataCenters: Dispatch<SetStateAction<DataCenter[]>>;
  navbarHeight: number;
  refetchEvents: boolean;
  refetchEventsTrigger: React.Dispatch<SetStateAction<boolean>>;
}

const EventsPage = (eventPageProps: EventPageProps) => {
  const { dataCenters, maps, worldServers, treasureMaps, setDataCenters, navbarHeight, refetchEvents } = eventPageProps;
  const eventsPageMatch = useMatch(ROUTES.EVENTS_PAGE);
  const eventsAttendingMatch = useMatch(ROUTES.EVENTS_ATTENDING);
  const eventsDetailModalNewMatch = useMatch(ROUTES.EVENTS_DETAIL_MODAL_NEW);
  const eventsDetailModalIntegratedMatch = useMatch(ROUTES.EVENTS_DETAIL_MODAL_INTEGRATED);
  const eventsDetailModalMatch = useMatch(ROUTES.EVENTS_DETAIL_MODAL);
  const isOnEventsPageOrEventsDetailModal = eventsPageMatch
    || eventsDetailModalNewMatch
    || eventsDetailModalIntegratedMatch
    || (eventsDetailModalMatch && (eventsDetailModalMatch.params.id && !isNaN(parseInt(eventsDetailModalMatch.params.id))));

  // SORTING & FILTERING STATE
  const [selectedSortOption, setSelectedSortOption] = useState<SortOption>(SORT_OPTIONS.NUMBER_OF_GUESTS);
  const [selectedSortOrder, setSelectedSortOrder] = useState<SortOrder>(SORT_ORDERS.DESCENDING);
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [adultOnly, setAdultOnly] = useState<boolean>(false);
  const [selectedTreasureMaps, setSelectedTreasureMaps] = useState<TreasureMap[]>([]);
  const [selectedMaps, setSelectedMaps] = useState<string[]>([]);
  const [onlyLiveEvents, setOnlyLiveEvents] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [ffxivRpEvents, setFfxivRpEvents] = useState<Event[]>([]);

  const showFfxivRpEvents =
    selectedEventType === null
    && selectedGenres.length === 0
    && adultOnly === false
    && selectedTreasureMaps.length === 0
    && selectedMaps.length === 0
    && onlyLiveEvents === false;

  // PAGINATION STATE
  const [count, setCount] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const previousOffset = usePrevious(offset);

  // EVENT STATE
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);

  const ShowingResultsComponent = () =>
    <Text
      mt={{
        base: 0,
        sm: 3
      }}
      fontSize="xs"
      color={COLORS.WHITE}
    >
      Showing {events.length} of {count} results
    </Text>;

  const fetchEvents = useCallback(async () => {
    // If the offset didn't change, fetchEvents is being called because of other changes (filters, sorting, etc).
    // In that case, reset the offset because the count can have changed.
    if (offset !== 0 && previousOffset === offset) {
      setOffset(0);
      return;
    }

    const selectedWorldServers = worldServers
      .filter((worldServer) => worldServer.selected)
      .map((worldServer) => worldServer.name);

    const filters: EventFilters = {};

    if (selectedEventType) {
      filters[EVENT_FIELDS.TYPE] = selectedEventType;

      switch (selectedEventType) {
        case EVENT_TYPES.NIGHT_CLUB:
          if (selectedGenres.length) {
            filters[EVENT_FIELDS.GENRES] = selectedGenres;
          }

          break;

        case EVENT_TYPES.RP_VENUE:
          if (adultOnly) {
            filters[EVENT_FIELDS.ADULT_ONLY] = adultOnly;
          }

          break;

        case EVENT_TYPES.TREASURE_MAPS:
          if (selectedTreasureMaps.length) {
            filters[EVENT_FIELDS.TREASURE_MAPS] = selectedTreasureMaps;
          }

          break;

        default:
          break;
      }
    }

    if (selectedWorldServers.length) {
      filters[EVENT_FIELDS.SERVER] = selectedWorldServers;
    }

    if (selectedMaps.length) {
      filters[EVENT_FIELDS.MAP] = selectedMaps;
    }

    setIsLoadingEvents(true);

    const { rows, count } = await getEvents(
      EVENT_PAGE_LIMIT,
      offset,
      selectedSortOption.value,
      selectedSortOrder.value,
      filters,
      onlyLiveEvents,
      false,
      false,
      {}
    );

    setEvents(eventsState => {
      if (offset === 0) {
        return rows;
      } else {
        return [...eventsState, ...rows];
      }
    });

    setCount(count);

    setIsLoadingEvents(false);

    // Disable previousOffset missing from dependency array warning because we don't want previousOffset to trigger this useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    worldServers,
    selectedEventType,
    selectedMaps,
    selectedGenres,
    selectedTreasureMaps,
    offset,
    selectedSortOption.value,
    selectedSortOrder.value,
    onlyLiveEvents
  ]);

  const onChangeSelectedWorldServers = (dataCenter: DataCenter, worldServerNames: string[]) => {
    const dataCentersCopy = [...dataCenters];

    const foundDataCenter = dataCentersCopy.find((dataCentersCopyEntry) => dataCentersCopyEntry === dataCenter);

    if (foundDataCenter) {
      foundDataCenter.worldServers.forEach(worldServer => {
        worldServer.selected = worldServerNames.includes(worldServer.name);
      });

      setDataCenters(dataCentersCopy);
    }
  };

  // EVENTS
  useEffect(() => {
    (async () => {
      await fetchEvents();

      // const ffxivRpFeed = await axios.get('https://api.ffxiv-rp.org/api/Events/GetWeekTranslatableEvents', {
      //   withCredentials: false
      // });

      // const rawEvents: FfxivRpEvent[] = ffxivRpFeed.data;

      // const transformedEvents = rawEvents.map(rawEvent => transformFfxivRpEvent(rawEvent));

      // const distinctFfxivRpEvents = transformedEvents.filter((value, index, self) => {
      //   return self.findIndex(ffxivRpEvent => ffxivRpEvent.name === value.name) === index;
      // });

      // const shuffledDistinctFfxivRpEvents = distinctFfxivRpEvents
      //   .map(value => ({ value, sort: Math.random() }))
      //   .sort((a, b) => a.sort - b.sort)
      //   .map(({ value }) => value)

      // setFfxivRpEvents(shuffledDistinctFfxivRpEvents);
    })();
  },

    // Disable fetchEvents missing from dependency array warning because otherwise it does a few API requests.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchEvents, refetchEvents]
  );

  return (
    <Box
      height={`calc(100vh - ${navbarHeight}px)`}
    >
      <Flex
        direction="column"
        p={{
          base: 3,
          sm: 6
        }}
        position="absolute"
        top={`${navbarHeight}px`}
        left="0px"
        height={`calc(100vh - ${navbarHeight}px)`}
        width="100%"
      >
        <Flex
          direction={{
            base: "column",
            sm: "row"
          }}
          justifyContent={{
            base: "space-between",
            sm: "flex-start"
          }}
          alignItems={{
            base: "center",
            sm: "flex-end"
          }}
        >
          {isOnEventsPageOrEventsDetailModal ?
            <Flex
              direction={{
                base: "column",
                sm: "row"
              }}
              alignItems={{
                base: "center",
                sm: "flex-end"
              }}
              minWidth="fit-content"
            >
              <Flex
                direction="row"
                alignItems="center"
                minWidth="fit-content"

              >
                <Heading
                  size="md"
                  color={COLORS.WHITE}
                  minWidth="fit-content"
                >
                  I'm looking for {selectedEventType ? EVENT_TYPES_TO_ARTICLES[selectedEventType] : ""}
                </Heading>

                <Box
                  ml={2}
                >
                  <EventTypeSelect
                    selectedEventType={selectedEventType}
                    setSelectedEventType={setSelectedEventType}
                  />
                </Box>

                <Hide below="md">
                  <Heading
                    ml={2}
                    size="md"
                    color={COLORS.WHITE}
                  >
                    on
                  </Heading>
                </Hide>
              </Flex>

              <Flex
                mt={{
                  base: 1,
                  sm: 0
                }}
                ml={{
                  base: 0,
                  sm: 2
                }}
                direction="row"
                alignItems="center"
              >
                <Hide above="sm">
                  <Heading
                    mr={2}
                    size="md"
                    color={COLORS.WHITE}
                  >
                    on
                  </Heading>
                </Hide>

                <Box
                  maxWidth="300px"
                  height="40px"
                >
                  <ServerMenu
                    dataCenters={dataCenters}
                    onChangeSelectedWorldServers={onChangeSelectedWorldServers}
                  />
                </Box>
              </Flex>

              <Show
                below="md"
              >
                <Flex mt={1} justifyContent="center" width="100%">
                  <Button
                    aria-label="Filter"
                    colorScheme="whiteAlpha"
                    rightIcon={<Icon as={MdFilterList} />}
                    onClick={() => setIsFilterModalOpen(true)}
                  >
                    More filters
                  </Button>
                </Flex>

                <Modal
                  isOpen={isFilterModalOpen}
                  onClose={() => setIsFilterModalOpen(false)}
                >
                  <ModalOverlay />

                  <ModalContent
                    bgColor={COLORS.GREY_DARK}
                  >
                    <ModalHeader />

                    <ModalCloseButton color={COLORS.WHITE} />

                    <ModalBody>
                      <EventFilterList
                        onlyLiveEvents={onlyLiveEvents}
                        selectedEventType={selectedEventType}
                        maps={maps}
                        selectedMaps={selectedMaps}
                        selectedGenres={selectedGenres}
                        adultOnly={adultOnly}
                        treasureMaps={treasureMaps}
                        selectedTreasureMaps={selectedTreasureMaps}
                        setOnlyLiveEvents={setOnlyLiveEvents}
                        setSelectedEventType={setSelectedEventType}
                        setSelectedMaps={setSelectedMaps}
                        setSelectedGenres={setSelectedGenres}
                        setAdultOnly={setAdultOnly}
                        setSelectedTreasureMaps={setSelectedTreasureMaps}
                      />

                      <Box mt={6}>
                        <Heading
                          size="md"
                          color={COLORS.WHITE}
                        >
                          Sort
                        </Heading>

                        <Box
                          mt={3}
                        >
                          <SortMenu
                            selectedSortOption={selectedSortOption}
                            selectedSortOrder={selectedSortOrder}
                            setSelectedSortOption={setSelectedSortOption}
                            setSelectedSortOrder={setSelectedSortOrder}
                          />
                        </Box>
                      </Box>
                    </ModalBody>

                    <ModalFooter />
                  </ModalContent>
                </Modal>
              </Show>
            </Flex>
            :
            <Heading
              color={COLORS.WHITE}
              whiteSpace="nowrap"
            >
              {eventsAttendingMatch ?
                ("Attending")
                :
                ("Hosting")
              }
            </Heading>
          }

          {isOnEventsPageOrEventsDetailModal &&
            <>
              <Progress
                ml={{
                  base: 0,
                  sm: 3
                }}
                mt={{
                  base: 3,
                  sm: 0
                }}
                isIndeterminate={isLoadingEvents}
                size="xs"
                colorScheme="whiteAlpha"
                backgroundColor="rgba(0, 0, 0, 0)"
                borderRadius="lg"
                width="100%"
              />

              <Show
                above="sm"
              >
                <Box
                  ml={{
                    base: 3,
                    sm: 3
                  }}
                >
                  <SortMenu
                    selectedSortOption={selectedSortOption}
                    selectedSortOrder={selectedSortOrder}
                    setSelectedSortOption={setSelectedSortOption}
                    setSelectedSortOrder={setSelectedSortOrder}
                  />
                </Box>
              </Show>
            </>
          }
        </Flex>

        {isOnEventsPageOrEventsDetailModal ?
          <>
            <Grid
              mt={3}
              templateColumns={{
                base: "1fr",
                sm: "minmax(0, 2fr) 10fr"
              }}
              gap={3}
              overflow="hidden"
              height={{
                base: "auto",
                sm: "100%"
              }}
            >
              <GridItem>
                <Flex
                  direction="column"
                  height="100%"
                  justifyContent="space-between"
                  borderRadius="lg"
                  backgroundColor="rgba(0, 0, 0, 0.4)"
                  p={{
                    base: 0,
                    sm: 3
                  }}
                >
                  <Hide below="md">
                    <EventFilterList
                      onlyLiveEvents={onlyLiveEvents}
                      selectedEventType={selectedEventType}
                      maps={maps}
                      selectedMaps={selectedMaps}
                      selectedGenres={selectedGenres}
                      adultOnly={adultOnly}
                      treasureMaps={treasureMaps}
                      selectedTreasureMaps={selectedTreasureMaps}
                      setOnlyLiveEvents={setOnlyLiveEvents}
                      setSelectedEventType={setSelectedEventType}
                      setSelectedMaps={setSelectedMaps}
                      setSelectedGenres={setSelectedGenres}
                      setAdultOnly={setAdultOnly}
                      setSelectedTreasureMaps={setSelectedTreasureMaps}
                    />
                  </Hide>

                  <Flex
                    direction="row"
                    justifyContent={{
                      base: "flex-start",
                      sm: "center"
                    }}
                  >
                    <ShowingResultsComponent />
                  </Flex>
                </Flex>
              </GridItem>

              <GridItem
                id="infiniteScrollContainer"
                // overflow-y so no horizontal scrollbar is shown, auto so it only shows a scrollbar if it overflows
                overflowY="auto"
              >
                <EventsGrid
                  events={showFfxivRpEvents ? [...events, ...ffxivRpEvents] : events}
                  fetchMoreEvents={() => setOffset(prevOffset => prevOffset + EVENT_PAGE_LIMIT)}
                  hasMore={offset <= count}
                />
              </GridItem>
            </Grid>

            <Outlet />
          </>
          :
          <Outlet />
        }
      </Flex >
    </Box >
  );
};

export default EventsPage;
