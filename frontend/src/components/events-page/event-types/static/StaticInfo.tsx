import { Avatar, AvatarBadge, Box, Flex, Icon, IconButton, Image, Tag, Tooltip } from "@chakra-ui/react";
import { EventTypeInfoProps } from "../EventTypeInfo";
import NumberField from "../../event-modal/fields/NumberField";
import RoleField from "../../event-modal/fields/RoleField";
import { MdPerson } from "@react-icons/all-files/md/MdPerson";
import { COLORS } from "../../../../styles/theme";

const StaticInfo = (staticInfoProps: EventTypeInfoProps) => {
  const { isEditable, user, classes, formState, setFormState, attendRoleSlot } = staticInfoProps;

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

          <Box
            mt={3}
          >
            <RoleField
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
                  label={!user ?
                    "Sign in to attend role slot"
                    :
                    !roleSlot.isOpen ?
                      !roleSlot.guest ?
                        "This slot is already filled"
                        :
                        job ?
                          `${roleSlot.guest.displayName} as ${job.Name.charAt(0).toUpperCase() + job.Name.slice(1)}`
                          :
                          `${roleSlot.guest.displayName}`
                      :
                      (job ?
                        `Attend as ${job.Name.charAt(0).toUpperCase() + job.Name.slice(1)}`
                        :
                        "Attend role slot"
                      )
                  }
                  key={index}
                  shouldWrapChildren
                >
                  <IconButton
                    onClick={() => attendRoleSlot(index)}
                    isDisabled={!user || (!roleSlot.isOpen && !roleSlot.guest)}
                    ml={index === 0 ? 0 : 1}
                    aria-label="Role slot"
                    colorScheme={roleSlot.isOpen ? "blackAlpha" : roleSlot.guest ? "blackAlpha" : "red"}
                    size="lg"
                    icon={roleSlot.guest ?
                      <Avatar
                        size="sm"
                        name={job ? `${roleSlot.guest.displayName} as ${job.Name.charAt(0).toUpperCase() + job.Name.slice(1)}` : roleSlot.guest.displayName}
                        src={roleSlot.guest.photoUrl}
                      >
                        <AvatarBadge boxSize={4} bg={COLORS.WHITE}>
                          {job ?
                            <Image src={job ? `https://xivapi.com/${job.Icon}` : ""} />
                            :
                            <Icon as={MdPerson} />
                          }
                        </AvatarBadge>
                      </Avatar>
                      :
                      job ?
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
