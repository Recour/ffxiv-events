import { SetStateAction } from "react";
import FilterMenu from "./FilterMenu";

interface MapMenuProps {
  maps: string[];
  selectedMaps: string[];
  setSelectedMaps: React.Dispatch<SetStateAction<string[]>>;
}

const MapMenu = (mapMenuProps: MapMenuProps) => {
  const { maps, selectedMaps, setSelectedMaps } = mapMenuProps;

  return (
    <FilterMenu
      title={"Maps"}
      collection={maps}
      selectedCollection={selectedMaps}
      setSelectedCollection={setSelectedMaps}
    />
  );
};

export default MapMenu;
