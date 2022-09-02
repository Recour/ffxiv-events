import {
  Menu,
  Avatar,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  ComponentWithAs,
  IconProps,
  Flex,
} from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import isDev from "../../helpers/isDev";
import axios from "axios";
import { User } from "../../types/User";

interface UserMenuProps {
  user: User | null;
  colorScheme: string;
}

interface UserMenuAction {
  text: string;
  icon: ComponentWithAs<"svg", IconProps>;
  href: string;
}

const UserMenu = (userMenuProps: UserMenuProps) => {
  const { user, colorScheme } = userMenuProps;

  const AUTHORIZED_USER_MENU_ACTIONS: UserMenuAction[] = [
    {
      text: "Sign Out",
      icon: ExternalLinkIcon,
      href: `${isDev ? "http://localhost:4000" : ""}/auth/logout`
    },
  ];

  const UNAUTHORIZED_USER_MENU_ACTIONS: UserMenuAction[] = [
    {
      text: "Sign In With Google",
      icon: ExternalLinkIcon,
      href: `${isDev ? "http://localhost:4000" : ""}/auth/google`
    },
    {
      text: "Sign In With Discord",
      icon: ExternalLinkIcon,
      href: `${isDev ? "http://localhost:4000" : ""}/auth/discord`
    }
  ];

  const userMenuActions = user
    ? AUTHORIZED_USER_MENU_ACTIONS
    : UNAUTHORIZED_USER_MENU_ACTIONS;

  return (
    <Menu
      placement="bottom-end"
    >
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme={colorScheme} size="sm">
        <Flex direction="row" alignItems="center">
          {user && <Avatar src={user.photoUrl ?? undefined} size="xs" mr={2} />}
          {user?.displayName ?? "Sign In"}
        </Flex>
      </MenuButton>

      <MenuList>
        {userMenuActions.map((userMenuAction, index) => {
          return (
            <a
              href={userMenuAction.href}
              key={index}
            >
              <MenuItem
                icon={<userMenuAction.icon />}
                onClick={() => { axios.get(userMenuAction.href) }}
              >
                {userMenuAction.text}
              </MenuItem>
            </a>
          );
        })}
      </MenuList>
    </Menu >
  );
};

export default UserMenu;
