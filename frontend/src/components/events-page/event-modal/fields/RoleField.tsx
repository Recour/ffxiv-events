import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Flex, IconButton, Image, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Tooltip } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

interface Class {
  Name: string;
  Icon: string;
};

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

const RoleField = () => {

  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedPartyType, setSelectedPartyType] = useState<PartyType>(PARTY_TYPES.FULL);
  const [selectedClasses, setSelectedClasses] = useState<(Class | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  useEffect(() => {
    (async () => {
      const result = await axios.get("https://xivapi.com/classjob", {
        withCredentials: false
      });

      setClasses(result.data.Results);
    })();
  }, []);

  useEffect(() => {
    const newSelectedClasses = [];

    for (let i = 0; i < selectedPartyType.numberOfPlayers; i++) {
      newSelectedClasses.push(selectedClasses[i]);
    }

    setSelectedClasses(newSelectedClasses);
  }, [selectedPartyType, selectedClasses])

  return (
    <Flex
      direction="column"
      flexWrap="wrap"
      borderWidth={1}
      p={3}
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

      <Flex
        mt={{
          base: 2,
          sm: 3
        }}
        direction="row"
      >
        {selectedClasses.map((job, selectedJobIndex) => <>
          <Menu
          >
            <MenuButton
              as={IconButton}
              icon={job ? <Image boxSize={6} src={`https://xivapi.com/${job.Icon}`} /> : <AddIcon />}
              ml={selectedJobIndex === 0 ? 0 : 1}
              variant="outline"
              size="sm"
              colorScheme="blackAlpha"
            />

            <MenuList maxWidth={50}>
              {classes.map((job, index) =>
                <Tooltip
                  label={job.Name.charAt(0).toUpperCase() + job.Name.slice(1)}
                  key={index}
                >
                  <IconButton
                    m={1}
                    size="sm"
                    colorScheme="whiteAlpha"
                    aria-label={job.Name}
                    onClick={() => {
                      const newSelectedClasses = [...selectedClasses];

                      newSelectedClasses[selectedJobIndex] = job;

                      setSelectedClasses(newSelectedClasses);
                    }}
                  >
                    <Image
                      boxSize={6}
                      src={`https://xivapi.com/${job.Icon}`}
                    />
                  </IconButton>

                </Tooltip>
              )}
            </MenuList>
          </Menu>
        </>)}
      </Flex>
    </Flex>
  );
};

export default RoleField;
