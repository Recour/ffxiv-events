import {
  Box,
  Badge,
  AvatarGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Text,
  Icon,
} from "@chakra-ui/react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../consts/routes";
import { isHousingDistrict } from "../../helpers/isHousingDistrict";
import { isLive } from "../../helpers/isLive";
import { COLORS } from "../../styles/theme";
import { Event } from "../../types/Event";
import TooltipAvatar from "../shared/TooltipAvatar";
import { MdLocationOn } from "@react-icons/all-files/md/MdLocationOn";
import { MdAccessTime } from "@react-icons/all-files/md/MdAccessTime";
import { MdHelpOutline } from "@react-icons/all-files/md/MdHelpOutline";
import { MdPublic } from "@react-icons/all-files/md/MdPublic";
import { isIntegratedEvent } from "../../helpers/isIntegratedEvent";

interface NewBadgeConstraints {
  amount: number;
  unit: moment.unitOfTime.DurationConstructor;
}

const NEW_BADGE_CONSTRAINTS: NewBadgeConstraints = {
  amount: 1,
  unit: "hours",
};

interface EventCardProps {
  event: Event;
}

const EventCard = (eventCardProps: EventCardProps) => {
  const { event } = eventCardProps;
  const navigate = useNavigate();

  const isRecurring = event.recurrings.length;
  const isComingSoon = event.comingSoon;
  const isIntegrated = isIntegratedEvent(event);

  const showLiveBadge = isLive(event);
  const showPlot = isHousingDistrict(event.map);
  const showNewBadge = event.createdAt && moment
    .utc()
    .isBefore(
      moment
        .utc(event.createdAt)
        .add(NEW_BADGE_CONSTRAINTS.amount, NEW_BADGE_CONSTRAINTS.unit)
    );

  const startTimeMomentLocal = moment
    .utc(event.startTime)
    .local()
    .format("DD MMM HH:mm");

  const endTimeMomentLocal = moment
    .utc(event.endTime)
    .local()
    .format("DD MMM HH:mm");

  const createdAtMoment = moment.utc(event.createdAt);
  const updatedAtMoment = moment.utc(event.updatedAt);

  // Add 1 minute because the updated timestamp is always a few milliseconds later.
  const showUpdatedTimestamp = updatedAtMoment.isAfter(createdAtMoment.clone().add(1, "minute"));
  const updatedOrCreatedTimestamp = showUpdatedTimestamp ? updatedAtMoment : createdAtMoment;

  const handleClick = () => {
    if (event.id) {
      if (isIntegrated) {
        navigate(ROUTES.EVENTS_DETAIL_MODAL.replace(":id", event.id), {
          state: {
            event
          }
        })
      } else {
        navigate(ROUTES.EVENTS_DETAIL_MODAL.replace(":id", event.id))
      }
    } else {
      throw new Error(`Can't view an event without an ID: ${event}`);
    }
  };

  return (
    <Flex
      direction="column"
      justifyContent={isIntegrated ? "space-between" : "space-around"}
      height="100%"
      p={4}
      borderRadius="lg"
      backgroundColor="rgba(255, 255, 255, 0.9)"
      backgroundImage={event.backgroundImage ? `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${event.backgroundImage}")` : ""}
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      backgroundPosition="center center"
      color={event.backgroundImage ? COLORS.WHITE : ""}
      onClick={handleClick}
      _hover={{
        backgroundImage: event.backgroundImage ? `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("${event.backgroundImage}")` : "",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        cursor: "pointer",
        boxShadow: "dark-lg"
      }}
    >
      <Box>
        <Flex direction="row" justifyContent="space-between">
          <Flex
            alignItems="center"
            fontWeight="semibold"
            fontSize="xs"
          >
            <Icon w={3} h={3} mr={1} as={MdHelpOutline} />

            {event.type}
          </Flex>

          <Flex
            alignItems="center"
            fontWeight="semibold"
            fontSize="xs"
          >
            <Icon w={3} h={3} mr={1} as={MdPublic} />

            {event.server}
          </Flex>
        </Flex>

        <Flex
          direction="row"
          alignItems="center"
        >
          {showLiveBadge &&
            <Badge colorScheme="purple" mr={1}>Live</Badge>
          }

          <Text
            as="h4"
            lineHeight="tight"
            fontWeight="semibold"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {event.name}
          </Text>
        </Flex>

        <Flex
          direction="row"
          alignItems="center"
          fontWeight="semibold"
          letterSpacing="wide"
          fontSize="xs"
          textTransform="uppercase"
        >
          <Icon w={3} h={3} mr={1} as={MdAccessTime} />

          <Text
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {isRecurring ?
              `Every 
            ${event.recurrings
                .filter(recurring => {
                  const previousDayOfWeek = recurring.dayOfWeek - 1 < 1 ? 7 : recurring.dayOfWeek - 1

                  const twinRecurring = event.recurrings.find(potentialTwinRecurring =>
                    potentialTwinRecurring.dayOfWeek === previousDayOfWeek && potentialTwinRecurring.endTime === '23:59'
                  );

                  return !(recurring.startTime === '00:00' && twinRecurring);
                })
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                .map(recurring => moment().day(recurring.dayOfWeek).format("dddd"))
                .join(', ')
                .replace(/,(?=[^,]*$)/, ' and')
              }`
              :
              isComingSoon ?
                'Coming soon'
                :
                `${startTimeMomentLocal} - ${endTimeMomentLocal}`
            }
          </Text>
        </Flex>

        <Flex
          mb={2}
          direction="row"
          alignItems="center"
        >
          <Icon w={3} h={3} mr={1} as={MdLocationOn} />

          <Text
            fontWeight="semibold"
            fontSize="xs"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {event.map}

            {showPlot && (
              ` - W${event.ward} P${event.plot}`
            )}
          </Text>
        </Flex>
      </Box>

      {!isIntegrated &&
        <Flex direction="row" justifyContent="space-evenly" alignItems="center">
          {event.host &&
            <Stat maxWidth="fit-content">
              <StatLabel textAlign="center">Host</StatLabel>
              <StatNumber>
                <AvatarGroup size="xs" justifyContent="center">
                  <TooltipAvatar
                    borderColor={COLORS.GREY_LIGHT}
                    size="xs"
                    name={event.host.displayName}
                    src={event.host.photoUrl}
                  />
                </AvatarGroup>
              </StatNumber>
              <StatHelpText textAlign="center">1 host</StatHelpText>
            </Stat>
          }

          {event.guests &&
            <Stat maxWidth="fit-content">
              <StatLabel textAlign="center">Guests</StatLabel>
              <StatNumber>
                <AvatarGroup size="xs" justifyContent="center" max={3}>
                  {event.guests.map((guest, index) => (
                    <TooltipAvatar
                      borderColor={COLORS.GREY_LIGHT}
                      name={guest.displayName}
                      src={guest.photoUrl}
                      size="xs"
                      key={index}
                    />
                  ))}
                </AvatarGroup>
              </StatNumber>
              <StatHelpText textAlign="center">{event.guests.length} {event.guests.length > 1 || event.guests.length === 0 ? "guests" : "guest"}</StatHelpText>
            </Stat>
          }
        </Flex>
      }

      <Flex mt={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
        <Box fontWeight="semibold" fontSize="xs">
          {
            isIntegrated ?
              "Integrated event"
              :
              `${showUpdatedTimestamp ? "Updated" : "Created"} ${updatedOrCreatedTimestamp.local().fromNow()}`}
        </Box>

        {showNewBadge && (
          <Badge ml={1} borderRadius="full" px="2" colorScheme="teal">
            New
          </Badge>
        )}
      </Flex>
    </Flex>
  );
};

export default EventCard;
