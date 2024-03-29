import { Box } from "@chakra-ui/react";
import { SetStateAction } from "react";
import { Class } from "../../../types/Class";
import { NewEvent } from "../../../types/Event";
import { EventPalette } from "../../../types/EventPalette";
import { EVENT_TYPES } from "../../../types/EventType";
import { TreasureMap } from "../../../types/TreasureMap";
import { User } from "../../../types/User";
import NightClubInfo from "./night-club/NightClubInfo";
import RPVenueInfo from "./rp-venue/RPVenueInfo";
import StaticInfo from "./static/StaticInfo";
import TreasureMapsInfo from "./treasure-maps/TreasureMapsInfo";

export interface EventTypeInfoProps {
  isEditable: boolean;
  user: User | null;
  eventPalette: EventPalette;
  formState: NewEvent;
  setFormState: React.Dispatch<SetStateAction<NewEvent>>;
  attendRoleSlot: (roleSlotId: number) => void;
  treasureMaps: TreasureMap[];
  classes: Class[];
}

const EventTypeInfo = (eventTypeInfoProps: EventTypeInfoProps) => {
  const { eventPalette, formState } = eventTypeInfoProps;

  let EventTypeInfoComponent;

  switch (formState.type) {
    case EVENT_TYPES.RAID:
      EventTypeInfoComponent = StaticInfo;
      break;

    case EVENT_TYPES.STATIC:
      EventTypeInfoComponent = StaticInfo;
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
        {...eventPalette.fieldStyles}
      >
        <EventTypeInfoComponent {...eventTypeInfoProps} />
      </Box>
    )
  } else {
    return null;
  }
}

export default EventTypeInfo;
