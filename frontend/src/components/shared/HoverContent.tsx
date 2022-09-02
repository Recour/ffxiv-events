import { Box, Flex } from "@chakra-ui/layout";
import { useState } from "react";

interface HoverContentProps {
  hoverContent: React.ReactNode;
}

const HoverContent = (
  hoverContentProps: React.PropsWithChildren<HoverContentProps>
) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <Box
      height="100%"
      position="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box height="100%">{hoverContentProps.children}</Box>

      {isHovering && (
        <Flex
          position="absolute"
          top={0}
          right={0}
          bottom={0}
          left={0}
          margin="auto"
          justify="center"
          align="center"
          borderRadius="lg"
          backgroundColor={"rgba(0, 0, 0, 0.5)"}
        >
          {hoverContentProps.hoverContent}
        </Flex>
      )}
    </Box>
  );
};

export default HoverContent;
