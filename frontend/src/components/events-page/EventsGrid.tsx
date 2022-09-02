import { SimpleGrid } from "@chakra-ui/layout";
import { Event } from "../../types/Event";
import EventCard from "./EventCard";
import InfiniteScroll from 'react-infinite-scroll-component';

interface EventsGridProps {
  events: Event[];
  fetchMoreEvents: () => void;
  hasMore: boolean;
}

const EventsGrid = (eventsGridProps: EventsGridProps) => {
  const {
    events,
    fetchMoreEvents,
    hasMore
  } = eventsGridProps;

  return (
    <InfiniteScroll
      dataLength={events.length} //This is important field to render the next data
      next={fetchMoreEvents}
      hasMore={hasMore}
      loader={null}
      scrollableTarget="infiniteScrollContainer"
    >
      <SimpleGrid
        columns={[1, 1, 2, 3, 4]}
        gridAutoRows="1fr"
        spacing={3}
        height="100%"
        width="100%"
      >
        {events.map((event, index) => {
          return (
            <EventCard
              event={event}
              key={index}
            />
          );
        })}
      </SimpleGrid>
    </InfiniteScroll>
  );
};

export default EventsGrid;
