import { Box, Text } from "@chakra-ui/react";
import { SetStateAction } from "react";
import { NewEvent } from "../../../types/Event";
import { EVENT_TYPES } from "../../../types/EventType";
import { TreasureMap } from "../../../types/TreasureMap";
import NightClubInfo from "./night-club/NightClubInfo";
import RaidInfo from "./raid/RaidInfo";
import RPVenueInfo from "./rp-venue/RPVenueInfo";
import TreasureMapsInfo from "./treasure-maps/TreasureMapsInfo";

export interface EventTypeInfoProps {
  isEditable: boolean;
  formState: NewEvent;
  setFormState: React.Dispatch<SetStateAction<NewEvent>>;
  treasureMaps: TreasureMap[];
}

const EventTypeInfo = (eventTypeInfoProps: EventTypeInfoProps) => {
  const { isEditable, formState } = eventTypeInfoProps;

  const NoEventTypeInfoComponent = () =>
    <Text color="gray.400">
      No event options available for {formState.type}
    </Text>;
  let EventTypeInfoComponent;

  switch (formState.type) {
    case EVENT_TYPES.RAID:
      EventTypeInfoComponent = RaidInfo;
      break;

    case EVENT_TYPES.NIGHT_CLUB:
      EventTypeInfoComponent = NightClubInfo;
      break;

    case EVENT_TYPES.RP_VENUE:
      EventTypeInfoComponent = RPVenueInfo;
      break;

    case EVENT_TYPES.TREASURE_MAPS:
      EventTypeInfoComponent = TreasureMapsInfo;
      break;

    default:
      if (isEditable) {
        EventTypeInfoComponent = NoEventTypeInfoComponent;
      }

      break;
  }

  if (EventTypeInfoComponent) {
    return (
      <Box
        mt={{
          base: 2,
          sm: 3
        }}
        p={3}
        borderWidth="1px"
        borderRadius="lg"
      >
        <EventTypeInfoComponent {...eventTypeInfoProps} />
      </Box>
    )
  } else {
    return null;
  }
}

export default EventTypeInfo;
