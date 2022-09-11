import { COLORS } from "../../../../styles/theme";
import SwitchField from "../../event-modal/fields/SwitchField";
import { EventTypeFiltersProps } from "../../filters/EventFilterList";

const RPVenueFilters = (rpVenueFiltersProps: EventTypeFiltersProps) => {
  const { adultOnly, setAdultOnly } = rpVenueFiltersProps;

  return (
    <SwitchField
      label={"Adult only"}
      value={adultOnly}
      setValue={(value: boolean) => setAdultOnly(value)}
      color={COLORS.WHITE}
      colorScheme="whiteAlpha"
    />
  );
}

export default RPVenueFilters;
