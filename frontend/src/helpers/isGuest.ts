import { Event } from "../types/Event";
import { User } from "../types/User";

export const isGuest = (user: User, event: Event) => {
  return event.guests.some(guest => guest.id === user.id);
};