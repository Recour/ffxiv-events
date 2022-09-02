import { ChevronRightIcon } from "@chakra-ui/icons";
import { Flex, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Image, LinkOverlay, LinkBox, Tabs, TabList, Tab, Show, Hide } from "@chakra-ui/react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { ROUTES } from "../../consts/routes";
import { COLORS } from "../../styles/theme";
import { User } from "../../types/User";
import EventsToolbox from "../events-page/EventsToolbox";
import UserMenu from "./UserMenu";

interface NavbarProps {
  user: User | null;
  navbarRef: void;
}

const Navbar = (navbarProps: NavbarProps) => {
  const { user, navbarRef } = navbarProps;
  const location = useLocation();
  const navigate = useNavigate();

  const landingPageMatch = useMatch(ROUTES.LANDING_PAGE);
  const eventsPageMatch = useMatch(ROUTES.EVENTS_PAGE);
  const eventsDetailModalNewMatch = useMatch(ROUTES.EVENTS_DETAIL_MODAL_NEW);
  const eventsDetailModalMatch = useMatch(ROUTES.EVENTS_DETAIL_MODAL);
  const eventsAttendingMatch = useMatch(ROUTES.EVENTS_ATTENDING);
  const eventsHostingMatch = useMatch(ROUTES.EVENTS_HOSTING);
  const communityPageMatch = useMatch(ROUTES.COMMUNITY_PAGE);
  const isOnEventsPageOrEventsDetailModal = eventsPageMatch
    || eventsDetailModalNewMatch
    || (eventsDetailModalMatch && (eventsDetailModalMatch.params.id && !isNaN(parseInt(eventsDetailModalMatch.params.id))));

  const isOnEvents = (isOnEventsPageOrEventsDetailModal || eventsAttendingMatch || eventsHostingMatch) ?? false;

  const TABS = [
    {
      name: "Events",
      route: ROUTES.EVENTS_PAGE,
    },
    {
      name: "Attending",
      route: ROUTES.EVENTS_ATTENDING,
    },
    {
      name: "Hosting",
      route: ROUTES.EVENTS_HOSTING
    }
  ];

  let tabIndex: number;

  switch (location.pathname) {
    case ROUTES.EVENTS_ATTENDING:
      tabIndex = 1;
      break;

    case ROUTES.EVENTS_HOSTING:
      tabIndex = 2;
      break;

    default:
      tabIndex = 0;
      break;
  };

  const TabsComponent = () =>
    <Tabs
      index={tabIndex}
      size="sm"
      variant="solid-rounded"
      colorScheme="whiteAlpha"
      borderRadius="lg"
    >
      <TabList>
        {TABS.map((tab, index) =>
          <Tab
            color={COLORS.WHITE}
            mx={1}
            onClick={() => navigate(tab.route)}
            key={index}
          >
            {tab.name}
          </Tab>
        )}
      </TabList>
    </Tabs>;

  return (
    <Box
      ref={navbarRef as unknown as React.LegacyRef<HTMLDivElement>}
    >
      {!landingPageMatch &&
        <Flex
          direction="column"
          bgColor="rgba(0, 0, 0, 0.4)"
          px={{
            base: 3,
            sm: 6
          }}
          py={{
            base: 1,
            sm: 3
          }}
        >
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex direction="row" alignItems="center">
              <LinkBox>
                <LinkOverlay href={ROUTES.LANDING_PAGE}>
                  <Image
                    src={`${process.env.PUBLIC_URL}/img/ffxiv-events.png`}
                    borderRadius="full"
                    boxSize={38}
                    alt="FFXIV Events"
                  />
                </LinkOverlay>
              </LinkBox>

              <Breadcrumb
                fontSize={{
                  base: "xs",
                  md: "sm"
                }}
                color={COLORS.WHITE}
                fontWeight="bold"
                separator={<ChevronRightIcon />}
              >
                <BreadcrumbItem />

                {isOnEvents ?
                  <BreadcrumbItem>
                    <BreadcrumbLink href={ROUTES.EVENTS_PAGE}>Events</BreadcrumbLink>
                  </BreadcrumbItem>
                  :
                  communityPageMatch &&
                  <BreadcrumbItem>
                    <BreadcrumbLink href={ROUTES.COMMUNITY_PAGE}>Community</BreadcrumbLink>
                  </BreadcrumbItem>
                }
              </Breadcrumb>
            </Flex>

            {isOnEvents && user &&
              <Show above="sm">
                <TabsComponent />
              </Show>
            }

            <Flex direction="row">
              {isOnEvents && user && (
                <Box
                  ml={{
                    base: 2,
                    sm: 3
                  }}
                >
                  <EventsToolbox />
                </Box>
              )}

              <Box
                ml={{
                  base: 2,
                  sm: 3
                }}
              >
                <UserMenu user={user} colorScheme="whiteAlpha" />
              </Box>
            </Flex>
          </Flex>

          {isOnEvents && user &&
            <Hide above="sm">
              <Flex
                justifyContent="center"
              >
                <Box mx={3} my={1}>
                  <TabsComponent />
                </Box>
              </Flex>
            </Hide>
          }
        </Flex>
      }

    </Box>
  );
};

export default Navbar;
