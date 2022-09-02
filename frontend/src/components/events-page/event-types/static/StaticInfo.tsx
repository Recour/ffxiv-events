import { Flex, Tag } from "@chakra-ui/react";
import { EventTypeInfoProps } from "../EventTypeInfo";
import NumberField from "../../event-modal/fields/NumberField";
import RoleField from "../../event-modal/fields/RoleField";

const StaticInfo = (staticInfoProps: EventTypeInfoProps) => {
  const { isEditable, formState, setFormState } = staticInfoProps;

  return (
    <>
      {isEditable ?
        <Flex
          direction="column"
        >
          <NumberField
            label={"Min iLvl"}
            value={formState.minIlvl}
            setValue={(value) => setFormState((formState) => ({
              ...formState,
              minIlvl: value
            }))}
            min={0}
            max={610}
            isEditable={true}
          />

          <RoleField />
        </Flex>
        :
        <Tag colorScheme="red" fontSize="sm">
          iLvl {formState.minIlvl}
        </Tag>
      }
    </>
  )
}

export default StaticInfo;
