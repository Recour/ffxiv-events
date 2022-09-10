import { RepeatIcon } from "@chakra-ui/icons";
import { Button, Flex } from "@chakra-ui/react";
import { EventModalFieldProps } from "../../../../types/EventModalFieldProps";
import { EVENT_PALETTES } from "../../../../types/EventPalette";

interface CustomizationFieldProps extends EventModalFieldProps {
  palette: string;
  setPalette: (palette: string) => void;
}

const CustomizationField = (customizationFieldProps: CustomizationFieldProps) => {
  const { isEditable, palette, setPalette } = customizationFieldProps;

  const nextPaletteIndex = Object.keys(EVENT_PALETTES).findIndex((eventPaletteName) => eventPaletteName === palette) + 1;
  const correctedNextPaletteIndex = nextPaletteIndex >= Object.keys(EVENT_PALETTES).length ? 0 : nextPaletteIndex;
  const nextPalette = Object.keys(EVENT_PALETTES)[correctedNextPaletteIndex];

  return (
    <>
      {isEditable &&
        <Flex
          direction="row"
        >
          <Button
            aria-label="Night Mode"
            colorScheme={EVENT_PALETTES[palette].colorScheme}
            variant="ghost"
            leftIcon={<RepeatIcon />}
            onClick={() => setPalette(nextPalette)}
          >
            Change theme
          </Button>
        </Flex>
      }
    </>
  );
};

export default CustomizationField;
