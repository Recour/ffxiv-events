import { PlusSquareIcon, QuestionOutlineIcon, SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../consts/routes";
import { COLORS } from "../../styles/theme";
import { EVENT_TYPES, EVENT_TYPES_TO_ARTICLES } from "../../types/EventType";

interface LandingPageProps {
  navbarHeight: number;
}

const LandingPage = (landingPageProps: LandingPageProps) => {
  const { navbarHeight } = landingPageProps;

  const navigate = useNavigate();

  const [alternatingEventTypeIndex, setAlternatingEventTypeIndex] = useState<number>(0);

  useEffect(
    () => {
      let timer = setTimeout(() => {
        let newAlternatingEventTypeIndex = alternatingEventTypeIndex + 1;

        if (newAlternatingEventTypeIndex >= Object.values(EVENT_TYPES).length) {
          newAlternatingEventTypeIndex = 0;
        }

        setAlternatingEventTypeIndex(newAlternatingEventTypeIndex);
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }, [alternatingEventTypeIndex]);

  return (
    <>
      <Flex
        height={`calc(100vh - ${navbarHeight}px)`}
        direction="column"
        background="linear-gradient(31deg, rgba(0,0,0,1) 0%, rgba(4,4,54,1) 35%, rgba(3,86,103,1) 100%)"
      >
        <Flex
          direction={{
            base: "column",
            sm: "row"
          }}
          height="100%"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <img
            alt="FFXIV Events"
            src={`${process.env.PUBLIC_URL}/img/ffxiv-events2.png`}
            height="25%"
            width="25%"
          />

          <Flex direction="column">
            <Heading
              mt={{
                base: 0,
                sm: 3
              }}
              size={{
                base: "sm",
                sm: "lg"
              }}
              color={COLORS.GREY_LIGHT}
            >
              Host social events, raids and more
            </Heading>

            <Flex
              direction="column"
              mt={{
                base: 6,
                sm: 12
              }}
              alignItems="flex-start"
            >
              <Button
                colorScheme="whiteAlpha"
                color={COLORS.GREY_LIGHT}
                variant="outline"
                rightIcon={<SearchIcon />}
                size="lg"
                onClick={() => {
                  navigate(ROUTES.EVENTS_PAGE);
                }}
                textAlign="start"
                py={2}
                height="100%"
                justifyContent="space-between"
                width={{
                  base: "100%",
                  sm: "auto"
                }}
              >
                <Box width={160}>
                  I'm looking for {EVENT_TYPES_TO_ARTICLES[Object.values(EVENT_TYPES)[alternatingEventTypeIndex]]}<br />
                  {Object.values(EVENT_TYPES)[alternatingEventTypeIndex]}
                </Box>
              </Button>

              <Button
                mt={{
                  base: 2,
                  sm: 3
                }}
                rightIcon={<PlusSquareIcon />}
                colorScheme="whiteAlpha"
                variant="outline"
                size="lg"
                onClick={() => navigate(ROUTES.EVENTS_DETAIL_MODAL_NEW)}
                justifyContent="space-between"
                width={{
                  base: "100%",
                  sm: "auto"
                }}
              >
                I want to host an event
              </Button>

              <Button
                mt={{
                  base: 2,
                  sm: 3
                }}
                colorScheme="whiteAlpha"
                variant="outline"
                rightIcon={<QuestionOutlineIcon />}
                size="lg"
                onClick={() => navigate(ROUTES.COMMUNITY_PAGE)}
                justifyContent="space-between"
                width={{
                  base: "100%",
                  sm: "auto"
                }}
              >
                What is FFXIV Events
              </Button>
            </Flex>
          </Flex>
        </Flex>

        {/* <Center
            height="50%"
            alignItems="flex-start"
          >
            <Flex
              mt={3}
            >
              <EventTabs />
            </Flex>
          </Center> */}
      </Flex>
    </>
  );
}

export default LandingPage;
