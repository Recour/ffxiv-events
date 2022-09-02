import { Comment } from "./Comment";
import { EventType } from "./EventType";
import { Recurring } from "./Recurring";
import { TreasureMap } from "./TreasureMap";
import { User } from "./User";

export interface NewEvent {
  name: string;
  type: EventType;
  server: string;
  map: string;
  ward: number;
  plot: number;
  startTime: string;
  endTime: string;
  comingSoon: boolean;
  recurrings: Recurring[];
  description: string;
  website: string;
  video: string;

  // RAID
  minIlvl: number;

  // FC EVENT

  // BARD PERFORMANCE

  // ETERNAL BONDING

  // TREASURE MAPS
  treasureMaps: TreasureMap[];

  // HUNT TRAIN

  // RP VENUE
  adultOnly: boolean;

  // NIGHT CLUB
  genres: string[];
}

export interface Event extends NewEvent {
  id: string;
  createdAt: string;
  updatedAt: string;
  host: User;
  hostId: number;
  guests: User[];
  countGuests?: number;
  backgroundImage: string;
  comments: Comment[];
}

export const DUMMY_EVENT: Event = {
  id: "",
  name: "Dummy name",
  server: "Dummy server",
  map: "Dummy map",
  ward: 0,
  plot: 0,
  startTime: "Dummy start time",
  recurrings: [],
  guests: [],
  createdAt: "",
  updatedAt: "",
  host: {
    id: 0,
    displayName: "",
    email: "",
    photoUrl: ""
  },
  hostId: 0,
  type: "",
  endTime: "",
  comingSoon: false,
  description: "",
  website: "",
  video: "",
  backgroundImage: "",
  comments: [],
  minIlvl: 0,
  treasureMaps: [],
  adultOnly: false,
  genres: []
};
