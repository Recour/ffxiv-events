import { Box, Flex, Icon, IconButton, Image, Tag, Tooltip } from "@chakra-ui/react";
import { EventTypeInfoProps } from "../EventTypeInfo";
import NumberField from "../../event-modal/fields/NumberField";
import RoleField from "../../event-modal/fields/RoleField";
import { MdPerson } from "@react-icons/all-files/md/MdPerson";

const StaticInfo = (staticInfoProps: EventTypeInfoProps) => {
  const { isEditable, eventPalette, classes, formState, setFormState } = staticInfoProps;

  return (
    <>
      {isEditable ?
        <Flex
          direction="column"
        >
          <NumberField
            fieldStyles={eventPalette.nestedFieldStyles}
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

          <Box
            mt={3}
          >
            <RoleField
              eventPalette={eventPalette}
              classes={classes}
              roleSlots={formState.roleSlots}
              setRoleSlots={(newRoleSlots) => setFormState(formState => ({
                ...formState,
                roleSlots: newRoleSlots
              }))}
            />
          </Box>
        </Flex>
        :
        <Flex direction="column">
          <Tag
            width="fit-content"
            colorScheme="red"
            fontSize="sm"
          >
            iLvl {formState.minIlvl}
          </Tag>

          <Flex
            mt={3}
            direction="row"
          >
            {formState.roleSlots.map((roleSlot, index) => {
              const job = classes.find(job => job.ID === roleSlot.jobId);

              return (
                <Tooltip
                  label="Coming soon"
                  shouldWrapChildren
                >
                  <IconButton
                    isDisabled
                    ml={index === 0 ? 0 : 1}
                    aria-label="Role slot"
                    variant="outline"
                    colorScheme={roleSlot.isOpen ? "blackAlpha" : "red"}
                    size="sm"
                    icon={job ?
                      <Image
                        boxSize={6}
                        src={`https://xivapi.com/${job.Icon}`}
                      />
                      :
                      <Icon as={MdPerson} />
                    }
                  />
                </Tooltip>
              );
            })}
          </Flex>
        </Flex>
      }
    </>
  )
}

export default StaticInfo;
