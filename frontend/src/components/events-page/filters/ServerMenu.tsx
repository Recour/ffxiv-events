import {
  MenuOptionGroup,
  MenuItemOption
} from "@chakra-ui/react";
import { DataCenter } from "../../../types/DataCenter";
import FilterMenu from "./FilterMenu";

interface ServerMenuProps {
  dataCenters: DataCenter[];
  onChangeSelectedWorldServers: (dataCenter: DataCenter, worldServerNames: string[]) => void;
}

const ServerMenu = (serverMenuProps: ServerMenuProps) => {
  const { dataCenters, onChangeSelectedWorldServers } = serverMenuProps;

  const selectedWorldServerNames: string[] = [];
  dataCenters.forEach(dataCenter => {
    dataCenter.worldServers
      .filter(worldServer => worldServer.selected)
      .forEach(worldServer => selectedWorldServerNames.push(worldServer.name));
  });

  return (
    <FilterMenu
      title={"Servers"}
      selectedCollection={selectedWorldServerNames}
    >
      {dataCenters.map((dataCenter, index) =>
        <MenuOptionGroup
          type="checkbox"
          title={dataCenter.name}
          value={dataCenter.worldServers.filter(worldServer => worldServer.selected).map(worldServer => worldServer.name)}
          onChange={(worldServerNames) => onChangeSelectedWorldServers(dataCenter, worldServerNames as string[])}
          key={index}
        >
          {dataCenter.worldServers.map((worldServer, index) =>
            <MenuItemOption
              value={worldServer.name}
              key={index}
            >
              {worldServer.name}
            </MenuItemOption>
          )
          }
        </MenuOptionGroup>
      )}
    </FilterMenu>
  );
};

export default ServerMenu;
