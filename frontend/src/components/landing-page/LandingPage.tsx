import { ArrowForwardIcon, PlusSquareIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Flex, Heading, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../consts/routes";
import { COLORS } from "../../styles/theme";
import { EVENT_TYPES, EVENT_TYPES_TO_ARTICLES } from "../../types/EventType";

const WIDTHS = {
  base: "95%",
  sm: "90%",
  md: "80%",
  lg: "60%"
};

const LandingPage = () => {
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
      {/* Set overflow hidden because scale() resizes the image */}
      < Box overflow="hidden" >
        <Image
          height="100vh"
          width="100vw"
          objectFit="cover"
          position="relative"
          filter="blur(3px)"
          transform="scale(1.1)"
          background={`linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${process.env.PUBLIC_URL}/img/ffxiv-crowd.png')`}
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          zIndex={-2}
        />

        <Flex
          position="absolute"
          top="0"
          left="0"
          height="100vh"
          width="100vw"
          direction="column"
          justifyContent="space-evenly"
        >
          <Center
            height="50%"
          >
            <Flex
              direction="column"
              width={WIDTHS}
              alignItems="space-around"
            >
              <Heading
                size={{
                  base: "lg",
                  sm: "4xl"
                }}
                color={COLORS.WHITE}
              >
                FFXIV Events
              </Heading>

              <Heading
                mt={{
                  base: 0,
                  sm: 3
                }}
                size={{
                  base: "sm",
                  sm: "lg"
                }}
                color={COLORS.WHITE}
              >
                Host social events, raids and more
              </Heading>

              <Flex
                direction={{
                  base: "column",
                  sm: "row"
                }}
                mt={{
                  base: 6,
                  sm: 12
                }}
                alignItems="center"
                justifyContent={{
                  base: "space-between",
                  sm: "flex-start"
                }}
              >
                <Button
                  colorScheme="whiteAlpha"
                  rightIcon={<ArrowForwardIcon />}
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
                  ml={{
                    base: 0,
                    sm: 3
                  }}
                  mt={{
                    base: 2,
                    sm: 0
                  }}
                  rightIcon={<PlusSquareIcon />}
                  colorScheme="blackAlpha"
                  color={COLORS.WHITE}
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
                  ml={{
                    base: 0,
                    sm: 3
                  }}
                  mt={{
                    base: 2,
                    sm: 0
                  }}
                  colorScheme="blackAlpha"
                  rightIcon={<QuestionOutlineIcon />}
                  color={COLORS.WHITE}
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
          </Center>

          {/* <Center
            height="50%"
            alignItems="flex-start"
          >
            <Flex
              mt={3}
              width={WIDTHS}
            >
              <EventTabs />
            </Flex>
          </Center> */}
        </Flex>
      </Box >
    </>
  );
}

export default LandingPage;
