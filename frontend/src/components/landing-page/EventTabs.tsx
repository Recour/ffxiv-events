import { Tabs, Tab, TabList, TabPanel, TabPanels, Text } from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { EventField, EVENT_FIELDS, getEvents } from "../../database/events";
import { COLORS } from "../../styles/theme";
import { DUMMY_EVENT, Event } from "../../types/Event";
import { EventTableColumn, EVENT_TABLE_COLUMNS } from "../../types/EventTableColumn";
import { SortDirection, SORT_DIRECTIONS } from "../events-page/filters/SortMenu";
import EventTable from "./EventTable";

export const EVENT_TABLE_LIMIT = 5;

export interface EventTabTableColumn {
  column: EventTableColumn;
  showAbove?: "sm" | "md" | "lg" | "xl" | "2xl";
};

interface EventTab {
  name: string;
  order: EventField;
  direction: SortDirection;
  future: boolean;
  eventTableCaption: string;
  eventTabTableColumns: EventTabTableColumn[];
};

export const EVENT_TABS: EventTab[] = [
  {
    name: "Popular",
    order: EVENT_FIELDS.COUNT_GUESTS,
    direction: SORT_DIRECTIONS.DESCENDING,
    future: false,
    eventTableCaption: "Popular events",
    eventTabTableColumns: [
      {
        column: EVENT_TABLE_COLUMNS.NAME,
      },
      {
        column: EVENT_TABLE_COLUMNS.SERVER,
        showAbove: "md"
      },
      {
        column: EVENT_TABLE_COLUMNS.LOCATION,
        showAbove: "lg"
      },
      {
        column: EVENT_TABLE_COLUMNS.START_TIME,
        showAbove: "md"
      },
      {
        column: EVENT_TABLE_COLUMNS.GUESTS,
      }
    ]
  },
  {
    name: "Upcoming",
    order: EVENT_FIELDS.START_TIME,
    direction: SORT_DIRECTIONS.ASCENDING,
    future: true,
    eventTableCaption: "Upcoming events",
    eventTabTableColumns: [
      {
        column: EVENT_TABLE_COLUMNS.NAME,
      },
      {
        column: EVENT_TABLE_COLUMNS.SERVER,
        showAbove: "md"
      },
      {
        column: EVENT_TABLE_COLUMNS.LOCATION,
        showAbove: "lg"
      },
      {
        column: EVENT_TABLE_COLUMNS.GUESTS,
        showAbove: "md"
      },
      {
        column: EVENT_TABLE_COLUMNS.START_TIME,
      }
    ]
  }
];

const tabStyle = {
  color: COLORS.WHITE,
  margin: 6
}

const selectedTabStyle = {
  bg: "rgba(255, 255, 255, 0.5)"
};

const EventTabs = () => {
  const dummyEvents: Event[] = useMemo(() => {
    const dummyEvents = [];

    for (let i = 0; i < EVENT_TABLE_LIMIT; i++) {
      dummyEvents.push(DUMMY_EVENT);
    }

    return dummyEvents;
  }, []);

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [events, setEvents] = useState<Event[]>(dummyEvents);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const tab = EVENT_TABS[tabIndex];

      try {
        setIsLoadingEvents(true);
        setEvents(dummyEvents);

        const { rows } = await getEvents(
          EVENT_TABLE_LIMIT,
          0,
          tab.order,
          tab.direction,
          {},
          false,
          EVENT_TABS[tabIndex].future,
          false,
          {}
        );
        setEvents(rows);
      } catch (error) {
        throw new Error(`${error}`);
      } finally {
        setIsLoadingEvents(false);
      }
    })();
  }, [tabIndex, dummyEvents]);

  return (
    <Tabs
      variant="solid-rounded"
      size={{
        base: "sm",
        sm: "md",
      }}
      color={COLORS.WHITE}
      bg="rgba(0, 0, 0, 0.7)"
      width="100%"
      borderRadius="lg"
      onChange={(index) => setTabIndex(index)}
    >
      <TabList m={3}>
        {EVENT_TABS.map((tab, index) =>
          <Tab
            style={tabStyle}
            _selected={selectedTabStyle}
            key={index}
          >
            {tab.name}
          </Tab>
        )}
      </TabList>

      <TabPanels>
        {EVENT_TABS.map((tab, index) =>
          <TabPanel key={index}>
            {events.length ?
              <EventTable
                events={events}
                isLoading={isLoadingEvents}
                caption={tab.eventTableCaption}
                eventTabTableColumns={tab.eventTabTableColumns}
                buttonText="Details"
              />
              :
              <Text>No events found</Text>
            }
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
}

export default EventTabs;
