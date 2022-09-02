import moment from "moment";
import { Event } from "../types/Event";

export const isLive = (event: Event) => {
  if (event.comingSoon) {
    return false;
  }

  const currentTime = moment().toDate();
  return moment(event.startTime).isBefore(currentTime) && moment(event.endTime).isAfter(currentTime);
}
