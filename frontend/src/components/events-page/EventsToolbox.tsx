import { Flex, IconProps, ComponentWithAs, IconButton, Tooltip, Button, Show, Box } from "@chakra-ui/react";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../consts/routes";

interface EventsToolboxAction {
  icon: ComponentWithAs<"svg", IconProps>;
  text: string;
  onClick: () => void;
}

const EventsToolbox = () => {
  const navigate = useNavigate();

  const EVENTS_TOOLBOX_ACTIONS: EventsToolboxAction[] = [
    {
      icon: PlusSquareIcon,
      text: "Create event",
      onClick: () => {
        navigate(ROUTES.EVENTS_DETAIL_MODAL.replace(":id", "new"));
      },
    },
  ];

  return (
    <Flex direction="row">
      {EVENTS_TOOLBOX_ACTIONS.map((eventsToolboxAction, index) =>
        <Box key={index}>
          <Show below="md">
            <Tooltip label={eventsToolboxAction.text}>
              <IconButton
                onClick={eventsToolboxAction.onClick}
                icon={<eventsToolboxAction.icon />}
                colorScheme="whiteAlpha"
                size="sm"
                aria-label={eventsToolboxAction.text}
              />
            </Tooltip>
          </Show>

          <Show above="md">
            <Button
              onClick={eventsToolboxAction.onClick}
              rightIcon={<eventsToolboxAction.icon />}
              colorScheme="whiteAlpha"
              size="sm"
            >
              {eventsToolboxAction.text}
            </Button>
          </Show>
        </Box>
      )}
    </Flex>
  );
};

export default EventsToolbox;
