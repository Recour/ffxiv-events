import { Event } from "../types/Event";

export const INTEGRATED_EVENT_ID = "integrated";

export const isIntegratedEvent = (event: Event): boolean => {
  return event.id === INTEGRATED_EVENT_ID;
};
