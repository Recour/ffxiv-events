import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";

interface InfoTextProps {
  text: string;
};

const InfoText = (infoTextProps: InfoTextProps) => {
  const { text } = infoTextProps;

  return (
    <Flex
      fontSize="xs"
      alignItems="center"
    >
      <InfoOutlineIcon mr={2} />

      {text}
    </Flex>
  );
};

export default InfoText;
