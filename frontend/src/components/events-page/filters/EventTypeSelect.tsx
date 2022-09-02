import { Select } from "@chakra-ui/react";
import { SetStateAction } from "react";
import { COLORS } from "../../../styles/theme";
import { EventType, EVENT_TYPES } from "../../../types/EventType";

interface EventTypeSelectProps {
  selectedEventType: EventType | null;
  setSelectedEventType: React.Dispatch<SetStateAction<EventType | null>>;
}

const EventTypeSelect = (eventTypeSelectProps: EventTypeSelectProps) => {
  const { selectedEventType, setSelectedEventType } = eventTypeSelectProps;

  const eventTypes = Object.values(EVENT_TYPES);

  return (
    <Select
      value={selectedEventType ?? undefined}
      placeholder="All events"
      color={COLORS.WHITE}
      style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", fontWeight: "bold" }}
      variant="filled"
      width="fit-content"
      onChange={(e) => setSelectedEventType(e.target.value)}
    >
      {eventTypes.map((eventType, index) =>
        <option
          value={eventType}
          style={{ background: "black" }}
          key={index}
        >
          {eventType}
        </option>
      )}
    </Select>
  );
};

export default EventTypeSelect;
