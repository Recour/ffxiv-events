import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, Icon, IconButton, Image, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Class } from "../../../../types/Class";
import { RoleSlot } from "../../../../types/RoleSlot";
import { MdPerson } from "@react-icons/all-files/md/MdPerson";

interface PartyType {
  name: string;
  numberOfPlayers: number;
}

const PARTY_TYPES: { [key: string]: PartyType } = {
  LIGHT: {
    name: "Light Party",
    numberOfPlayers: 4
  },
  FULL: {
    name: "Full Party",
    numberOfPlayers: 8
  }
};

interface RoleFieldProps {
  classes: Class[];
  roleSlots: RoleSlot[];
  setRoleSlots: (roleSlots: RoleSlot[]) => void;
};

const RoleField = (roleFieldProps: RoleFieldProps) => {
  const { classes, roleSlots, setRoleSlots } = roleFieldProps;

  const [selectedPartyType, setSelectedPartyType] = useState<PartyType>(() => {
    const initialPartyTypeKey = Object.keys(PARTY_TYPES).find(partyTypeKey => PARTY_TYPES[partyTypeKey].numberOfPlayers === roleSlots.length);

    if (initialPartyTypeKey) {
      return PARTY_TYPES[initialPartyTypeKey];
    } else {
      return PARTY_TYPES.FULL;
    }
  });

  useEffect(() => {
    const newSelectedRoleSlots = [];

    for (let i = 0; i < selectedPartyType.numberOfPlayers; i++) {
      if (roleSlots[i]) {
        newSelectedRoleSlots.push(roleSlots[i]);
      } else {
        newSelectedRoleSlots.push({
          jobId: null,
          isOpen: true,
          guest: null
        });
      }
    }

    setRoleSlots(newSelectedRoleSlots);
  },
    // Disable selectedRoleSlots missing from dependency array warning because we one want updates on the selected party type.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedPartyType]
  )

  return (
    <Flex
      direction="column"
      flexWrap="wrap"
      borderWidth={1}
      p={3}
    >
      <Heading
        size="xs"
      >
        Roles
      </Heading>

      <Box
        mt={3}
      >
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            size="sm"
            width="fit-content"
            variant="outline"
          >
            {selectedPartyType.name}
          </MenuButton>

          <MenuList>
            <MenuOptionGroup
              value={selectedPartyType.name}
              type="radio"
            >
              {Object.values(PARTY_TYPES).map((partyType, index) =>
                <MenuItemOption
                  value={partyType.name}
                  onClick={() => setSelectedPartyType(partyType)}
                  key={index}
                >
                  {partyType.name}
                </MenuItemOption>
              )}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </Box>

      <Flex
        mt={{
          base: 2,
          sm: 3
        }}
        direction="row"
      >
        {roleSlots.map((roleSlot, roleSlotIndex) => {
          const job = roleSlot.jobId && classes.find(job => job.ID === roleSlot.jobId);

          return (
            <Menu
              closeOnSelect={false}
              key={roleSlotIndex}
            >
              <MenuButton
                as={IconButton}
                icon={job ?
                  <Image
                    boxSize={6}
                    src={`https://xivapi.com/${job.Icon}`}
                  />
                  :
                  <Icon as={MdPerson} />
                }
                ml={roleSlotIndex === 0 ? 0 : 1}
                variant="outline"
                size="sm"
                colorScheme={roleSlot.isOpen ? "blackAlpha" : "red"}
              />

              <MenuList maxWidth={50}>
                <MenuOptionGroup
                  value={JSON.stringify(roleSlot.isOpen)}
                  onChange={(value) => {
                    const newSelectedRoleSlots = [...roleSlots];

                    const selectedRoleSlot = newSelectedRoleSlots[roleSlotIndex];

                    if (selectedRoleSlot) {
                      selectedRoleSlot.isOpen = JSON.parse(value as string);
                    } else {
                      newSelectedRoleSlots[roleSlotIndex] = {
                        jobId: null,
                        isOpen: true,
                        guest: null
                      };
                    }

                    setRoleSlots(newSelectedRoleSlots);
                  }}
                  title="State"
                  type="radio"
                >
                  <MenuItemOption value="true">Open</MenuItemOption>
                  <MenuItemOption value="false">Filled</MenuItemOption>
                </MenuOptionGroup>

                <MenuOptionGroup
                  title="Class"
                  mt={3}
                >
                  {classes.map((job, index) =>
                    <Tooltip
                      label={job.Name.charAt(0).toUpperCase() + job.Name.slice(1)}
                      key={index}
                    >
                      <IconButton
                        m={1}
                        size="sm"
                        colorScheme={roleSlot.jobId === job.ID ? "blackAlpha" : "whiteAlpha"}
                        variant="outline"
                        aria-label={job.Name}
                        onClick={() => {
                          const newSelectedRoleSlots = [...roleSlots];

                          const selectedRoleSlot = newSelectedRoleSlots[roleSlotIndex];

                          if (selectedRoleSlot) {
                            if (selectedRoleSlot.jobId === job.ID) {
                              selectedRoleSlot.jobId = null;
                            } else {
                              selectedRoleSlot.jobId = job.ID;
                            }
                          } else {
                            newSelectedRoleSlots[roleSlotIndex] = {
                              jobId: job.ID,
                              isOpen: true,
                              guest: null
                            };
                          }

                          setRoleSlots(newSelectedRoleSlots);
                        }}
                      >
                        <Image
                          boxSize={6}
                          src={`https://xivapi.com/${job.Icon}`}
                        />
                      </IconButton>

                    </Tooltip>
                  )}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          )
        })}
      </Flex>
    </Flex>
  );
};

export default RoleField;
