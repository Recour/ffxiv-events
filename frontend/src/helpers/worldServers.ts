import { DataCenter } from "../types/DataCenter";
import { WorldServer } from "../types/WorldServer";

export const getWorldServersFromDataCenters = (
  dataCenters: DataCenter[]
): WorldServer[] => {
  const worldServers = dataCenters
    .map((dataCenter) => {
      return dataCenter.worldServers;
    })
    .flat();

  return worldServers;
};
