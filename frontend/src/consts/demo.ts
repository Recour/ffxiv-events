import { Event } from "../types/Event";
import { EVENT_TYPES } from "../types/EventType";

export const DEMO_USER = {
  id: 0,
  displayName: "Demo You",
  email: "demo@demo.com",
  photoUrl: "",
};

export const DEMO_USER_2 = {
  id: 1,
  displayName: "Demo User 1",
  email: "demo2@demo.com",
  photoUrl: "",
};

export const DEMO_USER_3 = {
  id: 2,
  displayName: "Demo User 2",
  email: "demo3@demo.com",
  photoUrl: "",
};

export const DEMO_USER_4 = {
  id: 3,
  displayName: "Demo User 3",
  email: "demo4@demo.com",
  photoUrl: "",
};

export const DEMO_EVENTS: Event[] = [
  {
    id: "0",
    name: "Demo Event",
    server: "Demo Server",
    map: "Demo Map",
    ward: 0,
    plot: 0,
    startTime: new Date().toISOString(),
    recurrings: [],
    guests: [DEMO_USER_2, DEMO_USER_4],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    host: DEMO_USER,
    hostId: DEMO_USER.id,
    type: EVENT_TYPES.RAID,
    endTime: new Date().toISOString(),
    comingSoon: false,
    palette: "black",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    website: "",
    video: "https://www.youtube.com/watch?v=onGE1-I2T6Y",
    backgroundImage:
      "https://lds-img.finalfantasyxiv.com/promo/h/G/X6-U2JYbC9_Oeyr19fH_rwiyeE.jpg",
    comments: [
      {
        id: "0",
        text: "Demo comment",
        createdAt: new Date(),
        user: DEMO_USER,
      },
      {
        id: "1",
        text: "Another demo comment",
        createdAt: new Date(),
        user: DEMO_USER_2,
      },
    ],
    minIlvl: 590,
    roleSlots: [],
    treasureMaps: [],
    adultOnly: false,
    genres: [],
  },
  {
    id: "1",
    name: "Demo Event 2",
    server: "Demo Server",
    map: "Demo Map",
    ward: 0,
    plot: 0,
    startTime: new Date().toISOString(),
    recurrings: [],
    guests: [DEMO_USER, DEMO_USER_3, DEMO_USER_4],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    host: DEMO_USER_2,
    hostId: DEMO_USER_2.id,
    type: EVENT_TYPES.GLAMOUR_CONTEST,
    endTime: new Date().toISOString(),
    comingSoon: false,
    palette: "pink",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    website: "",
    video: "https://www.youtube.com/watch?v=RXL8Dy49QHc",
    backgroundImage:
      "https://www.allgamestaff.it/wp-content/uploads/2021/07/ffxiv_fashion_report_guida.jpg",
    comments: [
      {
        id: "0",
        text: "Demo comment",
        createdAt: new Date(),
        user: DEMO_USER,
      },
      {
        id: "1",
        text: "Another demo comment",
        createdAt: new Date(),
        user: DEMO_USER_2,
      },
    ],
    minIlvl: 590,
    roleSlots: [],
    treasureMaps: [],
    adultOnly: false,
    genres: [],
  },
];
