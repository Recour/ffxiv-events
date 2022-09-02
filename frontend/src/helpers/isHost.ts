import { Event } from "../types/Event";
import { User } from "../types/User";

export const isHost = (user: User, event: Event) => {
  return event.host.id === user.id;
};
