import { Flex, Switch, Text } from "@chakra-ui/react";
import { COLORS } from "../../../../styles/theme";
import { EventTypeFiltersProps } from "../../filters/EventFilterList";

const RPVenueFilters = (rpVenueFiltersProps: EventTypeFiltersProps) => {
  const { adultOnly, setAdultOnly } = rpVenueFiltersProps;

  return (
    <Flex direction="row" alignItems="center">
      <Text
        color={COLORS.WHITE}
      >
        Adult only
      </Text>

      <Switch
        ml={{
          base: 2,
          sm: 3
        }}
        isChecked={adultOnly}
        onChange={(e) => setAdultOnly(e.target.checked)}
        colorScheme="whiteAlpha"
      />
    </Flex>
  );
}

export default RPVenueFilters;
