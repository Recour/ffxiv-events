import axios from "axios";
import { SortDirection } from "../components/events-page/filters/SortMenu";
import { Event, NewEvent } from "../types/Event";
import { RecurringFilters } from "../types/Recurring";

export type EventField = keyof Event;

export const EVENT_FIELDS: { [key: string]: EventField } = {
  ID: "id",
  NAME: "name",
  TYPE: "type",
  SERVER: "server",
  MAP: "map",
  WARD: "ward",
  PLOT: "plot",
  START_TIME: "startTime",
  END_TIME: "endTime",
  DESCRIPTION: "description",
  CREATED_AT: "createdAt",
  HOST: "host",
  HOST_ID: "hostId",
  GUESTS: "guests",
  VIDEO: "video",
  GENRES: "genres",
  ADULT_ONLY: "adultOnly",
  TREASURE_MAPS: "treasureMaps",

  COUNT_GUESTS: "countGuests"
};

export type EventFilters = {
  [key in EventField]?: boolean | number | string | string[];
};

const createFormDataFromEvent = (event: Event | NewEvent, backgroundImageFile: File | null) => {
  // Use FormData because it's needed to upload files.
  const formData = new FormData();

  Object.entries(event).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // Stringify array fields because otherwise the backend receives them as empty strings.
  formData.set("recurrings", JSON.stringify(event.recurrings));
  formData.set("genres", JSON.stringify(event.genres));
  formData.set("treasureMaps", JSON.stringify(event.treasureMaps));
  formData.set("roleSlots", JSON.stringify(event.roleSlots));

  if (backgroundImageFile) {
    formData.append("backgroundImageFile", backgroundImageFile);
  }

  return formData;
};

export const createEvent = async (newEvent: NewEvent, backgroundImageFile: File | null) => {
  try {
    const formData = createFormDataFromEvent(newEvent, backgroundImageFile);

    const response = await axios.post('/api/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response;
  } catch (e) {
    throw new Error(`Error creating event: ${e}`);
  }
};

export const updateEvent = async (event: Event, backgroundImageFile: File | null) => {
  try {
    const formData = createFormDataFromEvent(event, backgroundImageFile);

    const response = await axios.post('/api/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response;
  } catch (e) {
    throw new Error(`Error updating event: ${e}`);
  }
};

export const deleteEvent = async (event: Event) => {
  try {
    const response = await axios.delete('/api/events', {
      params: {
        id: event.id
      }
    });

    return response;
  } catch (e) {
    throw new Error(`Error deleting event: ${event.id}`);
  }
};

interface GetEventsResult {
  rows: Event[];
  count: number;
}

export const getEvents = async (
  limit: number,
  offset: number,
  order: EventField,
  direction: SortDirection,
  filters: EventFilters,
  live: boolean,
  future: boolean,
  attending: boolean,
  recurringFilters: RecurringFilters
): Promise<GetEventsResult> => {
  const response = await axios.get('/api/events', {
    params: {
      limit,
      offset,
      order,
      direction,
      filters,
      live,
      future,
      attending,
      recurringFilters
    }
  });

  const result: { rows: Event[], count: number } = response.data;

  return result;
};

export const getEvent = async (
  id: number
) => {
  const response = await axios.get('/api/events', {
    params: {
      id
    }
  });

  const event: Event = response.data;
  return event;
};

export const toggleAttendingEvent = async (event: Event) => {
  try {
    const response = await axios.post('/api/guests', null, {
      params: {
        id: event.id
      }
    });

    const updatedEvent: Event = response.data;
    return updatedEvent;
  } catch (e) {
    throw new Error(`Error adding guest to event: ${event.id}`);
  }
};

export const toggleAttendingRoleSlot = async (event: Event, roleSlotId: number) => {
  try {
    const response = await axios.post('/api/roleslots', null, {
      params: {
        eventId: event.id,
        roleSlotId
      }
    });

    const updatedEvent: Event = response.data;
    return updatedEvent;
  } catch (e) {
    throw new Error(`Error attending role slot: ${event.id} ${roleSlotId}`);
  }
};
