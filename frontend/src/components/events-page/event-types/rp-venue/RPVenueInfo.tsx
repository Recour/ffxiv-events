import { Flex, Tag } from "@chakra-ui/react";
import { EventTypeInfoProps } from "../EventTypeInfo";
import SwitchField from "../../event-modal/fields/SwitchField";

const RPVenueInfo = (rpVenueInfoProps: EventTypeInfoProps) => {
  const { isEditable, eventPalette, formState, setFormState } = rpVenueInfoProps;

  return (
    <>

      {isEditable ?
        <Flex
          direction="column"
        >
          {/* ADULT ONLY */}
          <SwitchField
            label={"Adult only"}
            value={formState.adultOnly}
            setValue={(value) => setFormState((formState) => ({
              ...formState,
              adultOnly: value
            }))}
            colorScheme={eventPalette.colorScheme}
          />
        </Flex>
        :
        <Tag colorScheme={formState.adultOnly ? "red" : "gray"} fontSize="sm">
          {formState.adultOnly ? "Adult only" : "Minor friendly"}
        </Tag>
      }
    </>
  )
}

export default RPVenueInfo;
