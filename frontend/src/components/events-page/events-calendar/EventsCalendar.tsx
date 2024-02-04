import { Box, Text } from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { EventFilters, getEvents } from "../../../database/events";
import { COLORS } from "../../../styles/theme";
import { DUMMY_EVENT, Event } from "../../../types/Event";
import { EVENT_TABLE_COLUMNS } from "../../../types/EventTableColumn";
import { User } from "../../../types/User";
import EventTable from "../../landing-page/EventTable";
import { SORT_DIRECTIONS, SORT_OPTIONS } from "../filters/SortMenu";
import { DEMO_EVENTS } from "../../../consts/demo";

const EVENTS_CALENDAR_LIMIT = 100;

interface EventsCalendarProps {
  user: User | null;
  type: "attending" | "hosting";
}

const EventsCalendar = (eventsCalendarProps: EventsCalendarProps) => {
  const dummyEvents: Event[] = useMemo(() => {
    const dummyEvents = [];

    for (let i = 0; i < 5; i++) {
      dummyEvents.push(DUMMY_EVENT);
    }

    return dummyEvents;
  }, []);

  const { user, type } = eventsCalendarProps;

  const [events, setEvents] = useState<Event[]>(dummyEvents);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          setIsLoadingEvents(true);
          setEvents(dummyEvents);

          const filters: EventFilters = {};

          if (type === "hosting") {
            filters.hostId = user.id;
          }

          // Comment for demo purposes
          // const { rows } = await getEvents(
          //   EVENTS_CALENDAR_LIMIT,
          //   0,
          //   SORT_OPTIONS.START_TIME.value,
          //   SORT_DIRECTIONS.ASCENDING,
          //   filters,
          //   false,
          //   false,
          //   (type === "attending"),
          //   {}
          // );
          setEvents(DEMO_EVENTS);
        } catch (error) {
          throw new Error(`${error}`);
        } finally {
          setIsLoadingEvents(false);
        }
      })();
    }
  }, [type, user, dummyEvents]);

  return (
    <Box mt={3} color={COLORS.WHITE} overflowY="auto">
      {events.length ?
        <EventTable
          events={events}
          isLoading={isLoadingEvents}
          caption={""}
          eventTabTableColumns={[
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
              column: EVENT_TABLE_COLUMNS.START_TIME
            },
            {
              column: EVENT_TABLE_COLUMNS.GUESTS,
              showAbove: "md"
            }
          ]}
          buttonText={type === "attending" ? "Details" : "Edit"}
        />
        :
        <Text>{`You are not ${type === "attending" ? "attending" : "hosting"} any events yet`}</Text>
      }
    </Box>
  );
};

export default EventsCalendar;
