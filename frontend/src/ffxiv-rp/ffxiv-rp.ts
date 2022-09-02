import { Event } from "../types/Event";

export interface FfxivRpEvent {
  server: string;
  eventName: string;
  shortDescription: string;
  eventCategory: string;
  eventURL: string;
  location: string;
  startTimeUTC: string;
  endTimeUTC: string;
};

export const transformFfxivRpEvent = (ffxivRpEvent: FfxivRpEvent): Event => {
  return {
    id: 'integrated',
    createdAt: '',
    updatedAt: '',
    host: {
      id: -1,
      displayName: '',
      email: '',
      photoUrl: ''
    },
    hostId: -1,
    guests: [],
    backgroundImage: '',
    comments: [],
    name: ffxivRpEvent.eventName,
    type: ffxivRpEvent.eventCategory,
    server: ffxivRpEvent.server,
    map: ffxivRpEvent.location,
    ward: 1,
    plot: 1,
    startTime: ffxivRpEvent.startTimeUTC,
    endTime: ffxivRpEvent.endTimeUTC,
    comingSoon: false,
    recurrings: [],
    description: ffxivRpEvent.shortDescription,
    website: ffxivRpEvent.eventURL,
    video: '',
    minIlvl: 0,
    treasureMaps: [],
    genres: [],
    adultOnly: false
  };
};
