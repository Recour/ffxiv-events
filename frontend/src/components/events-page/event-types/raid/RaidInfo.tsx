import { Tag } from "@chakra-ui/react";
import { EventTypeInfoProps } from "../EventTypeInfo";
import NumberField from "../../event-modal/fields/NumberField";

const RaidInfo = (raidInfoProps: EventTypeInfoProps) => {
  const { isEditable, formState, setFormState } = raidInfoProps;

  return (
    <>
      {isEditable ?
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
        :
        <Tag colorScheme="red" fontSize="sm">
          iLvl {formState.minIlvl}
        </Tag>
      }
    </>
  )
}

export default RaidInfo;
