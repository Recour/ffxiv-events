import { Avatar, AvatarProps } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";

const TooltipAvatar: typeof Avatar = (props: AvatarProps) => (
  <Tooltip label={props.name} key={props.key}>
    <Avatar {...props} />
  </Tooltip>
);

export default TooltipAvatar;
