import { Box, Container, Image, Progress, useDimensions, useMergeRefs } from "@chakra-ui/react";
import Navbar from "./components/core/Navbar";
import EventsPage from "./components/events-page/EventsPage";
import { useEffect, useRef, useState } from "react";
import * as Sentry from "@sentry/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorldServer } from "./types/WorldServer";
import { getWorldServersFromDataCenters } from "./helpers/worldServers";
import { DataCenter } from "./types/DataCenter";
import { XIVAPIMap } from "./types/XIVAPIMap";
import { TreasureMap } from "./types/TreasureMap";
import { XIVAPIItem } from "./types/XIVAPIItem";
import { ROUTES } from "./consts/routes";
import LandingPage from "./components/landing-page/LandingPage";
import isDev from "./helpers/isDev";
import axios from "axios";
import { getUser } from "./database/auth";
import { User } from "./types/User";
import EventModal from "./components/events-page/event-modal/EventModal";
import CommunityPage from "./components/community-page/CommunityPage";
import EventsCalendar from "./components/events-page/events-calendar/EventsCalendar";
import "focus-visible/dist/focus-visible";
import { useMeasure } from "react-use";
import { Class } from "./types/Class";

const XIVAPI = require("@xivapi/js");

const xiv = new XIVAPI();

axios.defaults.baseURL = isDev ? "http://localhost:4000" : "";
axios.defaults.withCredentials = true;

export interface DataCentersResponse {
  [key: string]: string[];
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dataCenters, setDataCenters] = useState<DataCenter[]>([]);
  const [worldServers, setWorldServers] = useState<WorldServer[]>([]);
  const [maps, setMaps] = useState<string[]>([]);
  const [treasureMaps, setTreasureMaps] = useState<TreasureMap[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [refetchEvents, refetchEventsTrigger] = useState<boolean>(false);

  const [measureRef, measure] = useMeasure();
  const dimensionRef = useRef<HTMLElement>() as React.MutableRefObject<HTMLDivElement>;
  const dimension = useDimensions(dimensionRef, true);
  const navbarRef: any = useMergeRefs(measureRef, dimensionRef);

  const navbarHeight = measure.height + (dimension?.padding?.top ?? 0) + (dimension?.padding?.bottom ?? 0) + (dimension?.border?.top ?? 0) + (dimension?.border?.bottom ?? 0);

  // When updating the loading queue, use previous state of loadingQueue.
  // We don't want useEffect hooks to listen to updates on the loading queue.
  const [loadingQueue, setLoadingQueue] = useState<number>(0);

  const NavbarWithProgress =
    <>
      <Navbar user={user} navbarRef={navbarRef} />
      <Progress
        isIndeterminate={loadingQueue > 0}
        size="xs"
        colorScheme="whiteAlpha"
        backgroundColor="rgba(0, 0, 0, 0)"
        width="100%"
        style={{ position: "absolute", top: 0 }}
      />
    </>;

  // USER
  useEffect(() => {
    (async () => {
      setLoadingQueue((loadingQueue) => loadingQueue + 1);

      const user = await getUser();
      setUser(user);

      setLoadingQueue((loadingQueue) => loadingQueue - 1);
    })();
  }, []);

  // DATACENTERS
  useEffect(() => {
    setLoadingQueue((loadingQueue) => loadingQueue + 1);

    xiv.data.datacenters()
      .then((response: DataCentersResponse) => {
        const mappedDataCenters = Object.entries(response).map(
          ([dataCenterName, worldServerNames]): DataCenter => {
            return {
              name: dataCenterName,
              worldServers: worldServerNames.map((worldServerName) => {
                return { name: worldServerName, selected: false };
              }),
            };
          }
        );

        setDataCenters(mappedDataCenters);
      })
      .finally(() => {
        setLoadingQueue((loadingQueue) => loadingQueue - 1);
      });
  }, [setLoadingQueue]);

  // WORLD SERVERS
  useEffect(() => {
    setLoadingQueue((loadingQueue) => loadingQueue + 1);

    const worldServers = getWorldServersFromDataCenters(dataCenters);
    setWorldServers(worldServers);

    setLoadingQueue((loadingQueue) => loadingQueue - 1);
  }, [dataCenters, setLoadingQueue]);

  // MAPS
  useEffect(() => {
    setLoadingQueue((loadingQueue) => loadingQueue + 1);

    fetch("https://xivapi.com/Map?limit=10000&columns=ID,PlaceName.Name")
      .then((response) => response.json())
      .then((data) => {
        const maps = data.Results;

        const mapsFiltered = maps
          .map((map: XIVAPIMap) => map.PlaceName.Name)
          .filter((map: string) => map)
          // Filter by unique values.
          .filter((value: string, index: number, self: string[]) => {
            return self.indexOf(value) === index;
          })
          .sort((mapA: string, mapB: string) => mapA > mapB ? 1 : -1);

        setMaps(mapsFiltered);
      })
      .finally(() => {
        setLoadingQueue((loadingQueue) => loadingQueue - 1);
      });
  }, [setLoadingQueue]);

  // TREASURE MAPS
  useEffect(() => {
    setLoadingQueue((loadingQueue) => loadingQueue + 1);
    xiv.search("Timeworn")
      .then((result: any) => {
        const treasureMaps = result.Results;

        const treasureMapsFiltered = treasureMaps
          .map((treasureMap: XIVAPIItem) => treasureMap.Name)
          // Filter by unique values.
          .filter((value: string, index: number, self: string[]) => {
            return self.indexOf(value) === index;
          });

        setTreasureMaps(treasureMapsFiltered);
      });
    setLoadingQueue((loadingQueue) => loadingQueue - 1);
  }, [setLoadingQueue]);

  // CLASSES
  useEffect(() => {
    (async () => {
      setLoadingQueue((loadingQueue) => loadingQueue + 1);

      const result = await axios.get("https://xivapi.com/classjob", {
        withCredentials: false
      });

      setClasses(result.data.Results);

      setLoadingQueue((loadingQueue) => loadingQueue - 1);
    })();
  }, []);

  return (
    <Sentry.ErrorBoundary showDialog={true}>
      {/* Set overflow hidden because scale() resizes the image */}
      <Box overflow="hidden">
        <Image
          height="100vh"
          width="100vw"
          position="relative"
          filter="blur(3px)"
          transform="scale(1.1)"
          background={`linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${process.env.PUBLIC_URL}/img/ffxiv-crowd.png')`}
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          zIndex={-2}
        />

        <Box
          position="absolute"
          top="0"
          left="0"
          height="100vh"
          width="100vw"
        >
          <BrowserRouter>
            <Routes>
              <Route
                path={ROUTES.LANDING_PAGE}
                element={NavbarWithProgress}
              />

              <Route
                path={ROUTES.EVENTS_PAGE}
                element={NavbarWithProgress}
              >
                <Route
                  path={ROUTES.EVENTS_ATTENDING}
                  element={NavbarWithProgress}
                />

                <Route
                  path={ROUTES.EVENTS_HOSTING}
                  element={NavbarWithProgress}
                />

                <Route
                  path={ROUTES.EVENTS_DETAIL_MODAL}
                  element={NavbarWithProgress}
                />
              </Route>

              <Route
                path={ROUTES.COMMUNITY_PAGE}
                element={NavbarWithProgress}
              />
            </Routes>

            <Routes>
              <Route
                path={ROUTES.LANDING_PAGE}
                element={
                  <LandingPage
                    navbarHeight={navbarHeight}
                  />
                }
              />

              <Route
                path={ROUTES.EVENTS_PAGE}
                element={
                  <Container maxW="container.xl">
                    <EventsPage
                      dataCenters={dataCenters}
                      maps={maps}
                      worldServers={worldServers}
                      treasureMaps={treasureMaps}
                      setDataCenters={setDataCenters}
                      navbarHeight={navbarHeight}
                      refetchEvents={refetchEvents}
                      refetchEventsTrigger={refetchEventsTrigger}
                    />
                  </Container>
                }
              >
                <Route path={ROUTES.EVENTS_ATTENDING} element={<EventsCalendar user={user} type="attending" />} />

                <Route path={ROUTES.EVENTS_HOSTING} element={<EventsCalendar user={user} type="hosting" />} />

                <Route
                  path={ROUTES.EVENTS_DETAIL_MODAL}
                  element={
                    <EventModal
                      worldServers={worldServers}
                      maps={maps}
                      treasureMaps={treasureMaps}
                      classes={classes}
                      user={user}
                      refetchEventsTrigger={refetchEventsTrigger}
                    />
                  }
                />
              </Route>

              <Route path={ROUTES.COMMUNITY_PAGE} element={<CommunityPage navbarHeight={navbarHeight} />} />
            </Routes>
          </BrowserRouter>
        </Box>
      </Box>
    </Sentry.ErrorBoundary >
  );
};

export default App;
