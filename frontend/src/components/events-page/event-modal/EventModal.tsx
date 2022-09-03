import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  FormControl,
  Flex,
  Box,
  FormLabel,
  useToast,
  Link,
  Spinner,
  Center,
  AvatarGroup,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  CircularProgress,
  Tooltip,
} from "@chakra-ui/react";
import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { WorldServer } from "../../../types/WorldServer";
import moment from "moment";
import { useLocation, useMatch, useNavigate, useParams } from "react-router-dom";
import {
  CheckIcon,
  CopyIcon,
  EditIcon,
  LinkIcon,
  LockIcon,
  PlusSquareIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { Event, NewEvent } from "../../../types/Event";
import { TreasureMap } from "../../../types/TreasureMap";
import EventTypeInfo from "../event-types/EventTypeInfo";
import { COLORS } from "../../../styles/theme";
import { ROUTES } from "../../../consts/routes";
import { createEvent, deleteEvent, getEvent, toggleAttendingEvent, updateEvent } from "../../../database/events";
import { User } from "../../../types/User";
import { isHost } from "../../../helpers/isHost";
import { isHousingDistrict } from "../../../helpers/isHousingDistrict";
import { isGuest } from "../../../helpers/isGuest";
import InputField from "./fields/InputField";
import SelectField from "./fields/SelectField";
import { EVENT_TYPES } from "../../../types/EventType";
import NumberField from "./fields/NumberField";
import TextAreaField from "./fields/TextAreaField";
import TooltipAvatar from "../../shared/TooltipAvatar";
import { MdLocationOn } from "@react-icons/all-files/md/MdLocationOn";
import { MdHelpOutline } from "@react-icons/all-files/md/MdHelpOutline";
import { MdPublic } from "@react-icons/all-files/md/MdPublic";
import FileUploadField from "./fields/FileUploadField";
import LinkField from "./fields/LinkField";
import ReactPlayer from "react-player";
import FrequencyField from "./fields/frequency/FrequencyField";
import CommentSection from "./fields/CommentSection";
import InfoText from "../../shared/InfoText";
import { TIME_FORMAT } from "./fields/frequency/DateTimeField";
import { Class } from "../../../types/Class";

export const EARLIEST_START_TIME = moment.utc().add(15 - (moment.utc().minute() % 15), "minutes");
export const EARLIEST_END_TIME = EARLIEST_START_TIME.clone().add(1, "hour");

const INITIAL_FORM_STATE: NewEvent = {
  // BASE PROPS
  name: "",
  type: "",
  server: "",
  map: "",
  ward: 1,
  plot: 1,
  startTime: EARLIEST_START_TIME.toISOString(),
  endTime: EARLIEST_END_TIME.toISOString(),
  comingSoon: false,
  recurrings: [],
  roleSlots: [
    {
      jobId: null,
      isOpen: true
    },
    {
      jobId: null,
      isOpen: true
    },
    {
      jobId: null,
      isOpen: true
    },
    {
      jobId: null,
      isOpen: true
    },
    {
      jobId: null,
      isOpen: true
    },
    {
      jobId: null,
      isOpen: true
    },
    {
      jobId: null,
      isOpen: true
    },
    {
      jobId: null,
      isOpen: true
    },
  ],
  description: "",
  website: "",
  video: "",

  // RAID
  minIlvl: 0,

  // TREASURE MAPS
  treasureMaps: [],

  // RP VENUE
  adultOnly: false,

  // NIGHT CLUB
  genres: []
};

interface CopyButtonState {
  icon: React.ReactElement;
  colorScheme: string;
  text: string;
}

const COPY_BUTTON_STATES: { [key: string]: CopyButtonState } = {
  COPY_LINK: {
    icon: <CopyIcon />,
    colorScheme: "blackAlpha",
    text: "Copy link"
  },
  COPIED: {
    icon: <CheckIcon />,
    colorScheme: "green",
    text: "Copied"
  }
};

interface EventModalLocationState {
  event: Event;
}

interface EventModalProps {
  worldServers: WorldServer[];
  maps: string[];
  treasureMaps: TreasureMap[];
  classes: Class[];
  user: User | null;
  refetchEventsTrigger: React.Dispatch<SetStateAction<boolean>>;
}

const EventModal = (eventModalProps: EventModalProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast()
  const { id } = useParams();
  const eventsDetailModalNewMatch = useMatch(ROUTES.EVENTS_DETAIL_MODAL_NEW);

  const { worldServers, maps, treasureMaps, classes, user, refetchEventsTrigger } = eventModalProps;

  const [event, setEvent] = useState<Event | null>(null);
  const [formState, setFormState] = useState<NewEvent>(INITIAL_FORM_STATE);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const [copyButtonState, setCopyButtonState] = useState<CopyButtonState>(COPY_BUTTON_STATES.COPY_LINK);
  const [isLoadingEvent, setIsLoadingEvent] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isViewingAsUser, setIsViewingAsUser] = useState<boolean>(eventsDetailModalNewMatch ? false : true);

  const userIsHost = user && event ? isHost(user, event) : false;
  const userIsGuest = user && event ? isGuest(user, event) : false;

  const isEditable = (!event || userIsHost) && !isViewingAsUser;

  const hasSelectedHousingDistrict = isHousingDistrict(formState.map);

  const formStateValidations: boolean[] = [
    !!user,
    !!formState.name,
    !!formState.server,
    !!formState.map,
    !!formState.startTime,
    !!formState.endTime,
    !!formState.description
  ];

  if (!formState.comingSoon) {
    // Times must be selected in 15-minute intervals
    formStateValidations.push(moment.utc(formState.startTime).minutes() % 15 === 0);
    formStateValidations.push(moment.utc(formState.endTime).minutes() % 15 === 0);

    formState.recurrings.forEach(recurring => {
      formStateValidations.push(moment.utc(recurring.startTime, TIME_FORMAT).minutes() % 15 === 0);
      formStateValidations.push(moment.utc(recurring.endTime, TIME_FORMAT).minutes() % 15 === 0);
    });

    if (!formState.recurrings.length) {
      // Additional time checks for one-time events
      formStateValidations.push(moment.utc(formState.startTime).isAfter(moment.utc()));
      formStateValidations.push(moment.utc(formState.startTime).isBefore(moment.utc(formState.endTime)));
      formStateValidations.push(moment.utc(formState.endTime).clone().subtract(1, "day").isBefore(moment.utc(formState.startTime)));
    }
  }

  const isFormStateValid = formStateValidations.every(formStateValidation => formStateValidation === true);

  const closeModal = useCallback(() => {
    navigate(ROUTES.EVENTS_PAGE);
  }, [navigate]);

  const handleClickCreateUpdate = useCallback(async () => {
    setIsSaving(true);

    // Validation
    if (isFormStateValid) {
      const newEvent: NewEvent = {
        name: formState.name,
        type: formState.type,
        server: formState.server,
        map: formState.map,
        ward: formState.ward,
        plot: formState.plot,
        startTime: formState.startTime,
        endTime: formState.endTime,
        comingSoon: formState.comingSoon,
        recurrings: formState.recurrings,
        description: formState.description,
        website: formState.website === "https://" ? "" : formState.website,
        video: formState.video === "https://" ? "" : formState.video,

        // RAID
        minIlvl: formState.minIlvl,
        roleSlots: formState.roleSlots,

        // TREASURE MAPS
        treasureMaps: formState.treasureMaps,

        // RP VENUE
        adultOnly: formState.adultOnly,

        // NIGHT CLUB
        genres: formState.genres
      };

      const eventAction = event ? updateEvent({ ...event, ...newEvent }, backgroundImageFile) : createEvent(newEvent, backgroundImageFile);

      try {
        await eventAction;

        toast({
          title: `Event ${event ? "updated" : "created"}!`,
          description: `Your event has been successfully ${event ? "updated" : "created"}.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: `Could not ${event ? "update" : "create"} your event.`,
          description: `Something went wrong while trying to ${event ? "update" : "create"} your event.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }

      setIsSaving(false);
      closeModal();
      refetchEventsTrigger((refetchEvents) => !refetchEvents);
    }
  }, [isFormStateValid, event, formState, backgroundImageFile, toast, closeModal, refetchEventsTrigger]);

  const handleClickCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);

    setCopyButtonState(COPY_BUTTON_STATES.COPIED);
    setTimeout(() => {
      setCopyButtonState(COPY_BUTTON_STATES.COPY_LINK);
    }, 2000)
  };

  const handleClickAttend = async (user: User, event: Event) => {
    setIsSaving(true);

    try {
      const updatedEvent = await toggleAttendingEvent(event);
      setEvent(updatedEvent);

      toast({
        title: userIsGuest ? "Removed as guest." : "Added as guest!",
        description: `You are ${userIsGuest ? "no longer attending" : "now attending"} ${event.name}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: `Could not ${userIsGuest ? "remove" : "add"} you as guest.`,
        description: `Something went wrong while trying to ${userIsGuest ? "remove" : "add"} you as a guest to ${event.name}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setIsSaving(false);
  };

  const removeEvent = async (event: Event) => {
    try {
      await deleteEvent(event);

      toast({
        title: `Event deleted.`,
        description: `Your event has been successfully deleted.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: `Could not delete your event.`,
        description: `Something went wrong while trying to delete your event.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  const handleClickDelete = async (event: Event) => {
    setIsDeleting(true);

    await removeEvent(event);

    setIsDeleting(false);
    closeModal();
    refetchEventsTrigger((refetchEvents) => !refetchEvents);
  };

  useEffect(() => {
    if (id) {
      if (id === "new") {
        const locationState = location.state as EventModalLocationState;

        if (locationState) {
          const { event: newIntegratedEvent } = location.state as EventModalLocationState;
          setFormState(() => ({
            ...newIntegratedEvent,
            type: '',
            server: '',
            map: ''
          }));
          setEvent(null);
          setIsViewingAsUser(false);
        }
      } else {
        (async () => {
          setIsLoadingEvent(true);

          const event = await getEvent(parseInt(id));
          setEvent(event);

          setIsLoadingEvent(false);
        })();
      }
    }
  },

    // Disable location.state missing from dependency array warning because it breaks the viewing of integrated events.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );

  useEffect(() => {
    if (event) {
      setFormState({
        name: event.name,
        type: event.type,
        server: event.server,
        map: event.map,
        startTime: event.startTime,
        endTime: event.endTime,
        comingSoon: event.comingSoon,
        recurrings: event.recurrings,
        description: event.description,
        website: event.website,
        video: event.video,

        // RAID
        minIlvl: event.minIlvl,
        roleSlots: event.roleSlots,

        // NIGHT CLUB
        ward: event.ward,
        plot: event.plot,
        genres: event.genres,

        // RP VENUE
        adultOnly: event.adultOnly,

        // TREASURE MAPS
        treasureMaps: event.treasureMaps
      });
    } else if (!(id === "new")) {
      setFormState(INITIAL_FORM_STATE);
    }
  }, [event, id]);

  return (
    <Modal
      size="4xl"
      isOpen={true}
      onClose={closeModal}
      closeOnOverlayClick={!isEditable}
    >
      <ModalOverlay />

      <ModalContent>
        {isLoadingEvent ?
          <>
            <ModalHeader />

            <ModalBody>
              <Center>
                <Spinner />
              </Center>
            </ModalBody>

            <ModalFooter />
          </>
          :
          <>
            <ModalHeader>
              <Flex
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                {/* NAME */}
                <InputField
                  isEditable={isEditable}
                  value={formState.name}
                  setValue={(newName) => {
                    if (newName.length < 64)
                      setFormState(formState => ({
                        ...formState,
                        name: newName
                      }))
                  }}
                />

                <Box
                  hidden={!userIsHost && !eventsDetailModalNewMatch}
                  ml={{
                    base: 2,
                    sm: 3
                  }}
                >
                  <Tooltip
                    label={
                      isViewingAsUser
                        ?
                        "Make changes to this event"
                        :
                        "View a draft of your changes. You will still need to click Update to save any changes after viewing the draft."
                    }
                  >
                    <Button
                      leftIcon={isViewingAsUser ? <EditIcon /> : <ViewIcon />}
                      onClick={() => setIsViewingAsUser(!isViewingAsUser)}
                    >
                      {isViewingAsUser ? "Edit" : "View draft"}
                    </Button>
                  </Tooltip>
                </Box>
              </Flex>
            </ModalHeader>

            <ModalBody>
              <Flex
                mt={{
                  base: 1,
                  sm: 2
                }}
                direction={{
                  base: "column",
                  sm: "row"
                }}
                justifyContent={{
                  base: "flex-start",
                  sm: "space-between"
                }}
                alignItems={{
                  base: "flex-start",
                  sm: "flex-start"
                }}
              >
                <Flex
                  width={{
                    base: "100%",
                    sm: "33%"
                  }}
                  justifyContent="flex-start"
                >
                  {/* TYPE */}
                  <SelectField
                    isEditable={isEditable}
                    placeholder="Select event type"
                    value={formState.type}
                    setValue={(newType) => {
                      setFormState(formState => ({
                        ...formState,
                        type: newType
                      }))
                    }}
                    icon={MdHelpOutline}
                  >
                    {Object.values(EVENT_TYPES).map((eventType, index) => (
                      <option value={eventType} key={index}>
                        {eventType}
                      </option>
                    ))}
                  </SelectField>
                </Flex>

                {/* SERVER */}
                <Flex
                  ml={{
                    base: 0,
                    sm: 3
                  }}
                  mt={{
                    base: 2,
                    sm: 0
                  }}
                  width={{
                    base: "100%",
                    sm: "33%"
                  }}
                  justifyContent={{
                    base: "flex-start",
                    sm: "center"
                  }}
                >
                  <SelectField
                    isEditable={isEditable}
                    placeholder="Select server"
                    value={formState.server}
                    setValue={(newServer) => {
                      setFormState(formState => ({
                        ...formState,
                        server: newServer
                      }))
                    }}
                    icon={MdPublic}
                  >
                    {worldServers
                      .sort((worldServerA: WorldServer, worldServerB: WorldServer) => worldServerA.name > worldServerB.name ? 1 : -1)
                      .map((worldServer, index) => (
                        <option value={worldServer.name} key={index}>
                          {worldServer.name}
                        </option>
                      ))}
                  </SelectField>
                </Flex>

                {/* LOCATION */}
                <Flex
                  direction="column"
                  ml={{
                    base: 0,
                    sm: 3
                  }}
                  mt={{
                    base: 2,
                    sm: 0
                  }}
                  width={{
                    base: "100%",
                    sm: "33%"
                  }}
                  alignItems={{
                    base: "flex-start",
                    sm: "flex-end"
                  }}
                >
                  <SelectField
                    isEditable={isEditable}
                    placeholder="Select map"
                    value={hasSelectedHousingDistrict ? (isEditable ? formState.map : `${formState.map} - W${formState.ward} P${formState.plot}`) : formState.map}
                    setValue={(newMap) => {
                      setFormState(formState => ({
                        ...formState,
                        map: newMap
                      }))
                    }}
                    icon={MdLocationOn}
                  >
                    {/* Sort housing districts first */}
                    {[
                      ...maps.filter(map => isHousingDistrict(map)),
                      ...maps.filter(map => !isHousingDistrict(map))
                    ]
                      .map((map, index) => (
                        <option value={map} key={index}>
                          {map}
                        </option>
                      ))}
                  </SelectField>

                  {isEditable && hasSelectedHousingDistrict &&
                    <Flex
                      mt={{
                        base: 2,
                        sm: 3
                      }}
                      direction="row"
                      justifyContent={{
                        base: "flex-start",
                        sm: "center"
                      }}
                      borderWidth={1}
                      borderRadius="lg"
                      px={3}
                      py={{
                        base: 2,
                        sm: 2
                      }}
                    >
                      {/* WARD */}
                      <NumberField
                        isEditable={isEditable}
                        label="Ward"
                        value={formState.ward}
                        setValue={(newWard) =>
                          setFormState((formState) => ({
                            ...formState,
                            ward: newWard
                          }))}
                        min={1}
                        max={24}
                      />

                      {/* PLOT */}
                      <Flex
                        direction="row"
                        alignItems="center"
                        ml={3}
                      >
                        <NumberField
                          isEditable={isEditable}
                          label="Plot"
                          value={formState.plot}
                          setValue={(newPlot) =>
                            setFormState((formState) => ({
                              ...formState,
                              plot: newPlot
                            }))}
                          min={1}
                          max={60}
                        />
                      </Flex>
                    </Flex>
                  }
                </Flex>
              </Flex>

              <Box
                mt={{
                  base: 2,
                  sm: 3
                }}
                borderWidth={1}
                borderRadius="lg"
                px={3}
                py={{
                  base: 2,
                  sm: 2
                }}
              >
                <FrequencyField
                  isEditable={isEditable}
                  formState={formState}
                  setFormState={setFormState}
                />
              </Box>

              {/* EVENT TYPE SPECIFIC INFO */}
              <EventTypeInfo
                isEditable={isEditable}
                formState={formState}
                setFormState={setFormState}
                treasureMaps={treasureMaps}
                classes={classes}
              />

              {/* WEBSITE */}
              {isEditable ?
                <Box
                  mt={{
                    base: 2,
                    sm: 3
                  }}
                >
                  <LinkField
                    placeholder={"Enter website link (optional)"}
                    value={formState.website}
                    setValue={(value) => setFormState((formState) => ({
                      ...formState,
                      website: value
                    }))}
                  />
                </Box>
                :
                formState.website &&
                <Flex
                  mt={{
                    base: 2,
                    sm: 3
                  }}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  backgroundColor={COLORS.GREY_LIGHT}
                  borderRadius="lg"
                >
                  <Link
                    href={formState.website}
                    isExternal
                    color={COLORS.GREY_NORMAL}
                    ml={4}
                    my={2}
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                  >
                    <LinkIcon mr={2} />

                    {formState.website}
                  </Link>
                </Flex>
              }


              {/* VIDEO */}
              {isEditable ?
                <Box mt={{
                  base: 2,
                  sm: 3
                }}>
                  <LinkField
                    placeholder={"Enter video/livestream link (optional)"}
                    value={formState.video}
                    setValue={(value) => setFormState((formState) => ({
                      ...formState,
                      video: value
                    }))}
                  />
                </Box>
                :
                formState.video &&
                <Box
                  mb={6} // Bottom margin because otherwise the ReactPlayer messes up the bottom margin
                  width="100%"
                  paddingTop="56.25%"
                  position="relative"
                >
                  <ReactPlayer
                    url={formState.video}
                    wrapper={Box}
                    mt={3}
                    overflow="hidden" // Needed for border radius to work
                    borderRadius="lg"
                    height="100%"
                    width="100%"
                    position="absolute"
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    fallback={
                      <Center
                        height="100%"
                        width="100%"
                        borderWidth={1}
                        borderRadius="lg"
                      >
                        <CircularProgress isIndeterminate color={COLORS.GREY_LIGHT} />
                      </Center>
                    }
                  />
                </Box>
              }

              {/* DESCRIPTION */}
              <Box
                mt={{
                  base: 2,
                  sm: 3
                }}
              >
                <TextAreaField
                  isEditable={isEditable}
                  value={formState.description}
                  setValue={(newDescription) => {
                    if (newDescription.length < 1000) {
                      setFormState((formState) => ({
                        ...formState,
                        description: newDescription
                      }));
                    }
                  }}
                />
              </Box>

              {/* BACKGROUND IMAGE */}
              {isEditable &&
                <Box
                  mt={{
                    base: 2,
                    sm: 3
                  }}
                >
                  <FileUploadField
                    file={backgroundImageFile}
                    setFile={(value) => setBackgroundImageFile(value)}
                    placeholder="Upload background image (.png, .jpg, .jpeg) (max. 10 MB) (optional)"
                    acceptedFileTypes=".png, .jpg, .jpeg"
                  />
                </Box>
              }

              {/* HOST & GUESTS */}
              {event && !isEditable &&
                <Flex mt={3} direction="row" justifyContent="space-evenly" alignItems="center">
                  {event.host &&
                    <Stat maxWidth="fit-content">
                      <StatLabel textAlign="center">Host</StatLabel>
                      <StatNumber>
                        <AvatarGroup
                          size={{
                            base: "sm",
                            sm: "md"
                          }}
                          justifyContent="center"
                        >
                          <TooltipAvatar
                            borderColor={COLORS.GREY_LIGHT}
                            size="md"
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
                        <AvatarGroup
                          size={{
                            base: "sm",
                            sm: "md"
                          }}
                          justifyContent="center"
                          max={3}
                        >
                          {event.guests.map((guest, index) => (
                            <TooltipAvatar
                              borderColor={COLORS.GREY_LIGHT}
                              name={guest.displayName}
                              src={guest.photoUrl}
                              size="md"
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

              {/* COMMENTS */}
              {event && !isEditable &&
                <FormControl
                  mt={{
                    base: 2,
                    sm: 3
                  }}
                >
                  <FormLabel
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    Comments
                  </FormLabel>

                  <CommentSection
                    user={user}
                    event={event}
                    setEvent={setEvent}
                  />
                </FormControl>
              }

              {/* SHARE */}
              {event && !isEditable &&
                <FormControl
                  mt={3}
                >
                  <FormLabel
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    Share event
                  </FormLabel>

                  <Flex
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    backgroundColor={COLORS.GREY_LIGHT}
                    borderRadius="lg"
                  >
                    <Link
                      href={window.location.href}
                      isExternal
                      color={COLORS.GREY_NORMAL}
                      ml={4}
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                    >
                      <LinkIcon mr={2} />

                      {window.location.href}
                    </Link>

                    <Button
                      size="sm"
                      leftIcon={copyButtonState.icon}
                      colorScheme={copyButtonState.colorScheme}
                      m={2}
                      onClick={handleClickCopyLink}
                      minWidth="fit-content"
                    >
                      {copyButtonState.text}
                    </Button>
                  </Flex>
                </FormControl>
              }
            </ModalBody>

            <ModalFooter>
              <Flex direction="column" alignItems="flex-end" width="100%">
                {user ?
                  (
                    isEditable ?
                      <Flex
                        direction="row"
                        justifyContent={event ? "space-between" : "flex-end"}
                        width="100%"
                      >
                        {event &&
                          <Button
                            onClick={() => handleClickDelete(event)}
                            isLoading={isDeleting}
                            loadingText="Deleting"
                            colorScheme="red"
                            width="fit-content"
                          >
                            Delete
                          </Button>
                        }

                        <Box>
                          <Button
                            variant="ghost"
                            onClick={closeModal}
                            mr={3}
                            width="fit-content"
                          >
                            {event ? "Cancel" : "Discard"}
                          </Button>

                          <Button
                            onClick={handleClickCreateUpdate}
                            isDisabled={!isFormStateValid}
                            isLoading={isSaving}
                            loadingText={event ? "Updating" : "Creating"}
                            colorScheme="blackAlpha"
                            width="fit-content"
                          >
                            {event ? "Update" : "Create"}
                          </Button>
                        </Box>
                      </Flex>
                      :
                      event && !userIsHost &&
                      <Button
                        leftIcon={userIsGuest ? <CheckIcon /> : <PlusSquareIcon />}
                        onClick={() => handleClickAttend(user, event)}
                        isLoading={isSaving}
                        loadingText={userIsGuest ? "Removing" : "Attending"}
                        colorScheme={userIsGuest ? "green" : "blackAlpha"}
                        width="fit-content"
                      >
                        {userIsGuest ? "Attending" : "Attend"}
                      </Button>

                  )
                  :
                  <Flex direction="row" justifyContent="flex-end" width="100%">
                    {eventsDetailModalNewMatch ?
                      <Button
                        leftIcon={<LockIcon />}
                        isDisabled
                        colorScheme="gray"
                        width="fit-content"
                      >
                        Sign in to create an event
                      </Button>
                      :
                      <Button
                        leftIcon={<LockIcon />}
                        isDisabled
                        colorScheme="gray"
                        width="fit-content"
                      >
                        Sign in to mark yourself as guest
                      </Button>}
                  </Flex>
                }

                {user && isEditable && !isFormStateValid &&
                  <Box mt={3}>
                    <InfoText
                      text="Please make sure all required fields are filled in. Times must be selected in 15-minute intervals. 
                    For one-time events, 
                    the start date must be in the future and the event can not be longer than 1 day."
                    />
                  </Box>
                }
              </Flex>
            </ModalFooter>
          </>
        }
      </ModalContent>
    </Modal >
  );
};

export default EventModal;
