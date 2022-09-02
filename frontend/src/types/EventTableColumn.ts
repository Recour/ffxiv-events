import { EventField, EVENT_FIELDS } from "../database/events";

export interface EventTableColumn {
  header: string;
  eventField: EventField;
  isNumeric?: boolean;
};

export const EVENT_TABLE_COLUMNS: { [key: string]: EventTableColumn } = {
  NAME: {
    header: "Event",
    eventField: EVENT_FIELDS.NAME
  },
  SERVER: {
    header: "Server",
    eventField: EVENT_FIELDS.SERVER
  },
  LOCATION: {
    header: "Location",
    eventField: EVENT_FIELDS.MAP
  },
  GUESTS: {
    header: "Guests",
    eventField: EVENT_FIELDS.GUESTS,
    isNumeric: true
  },
  START_TIME: {
    header: "Start time",
    eventField: EVENT_FIELDS.START_TIME,
    isNumeric: true
  }
};
