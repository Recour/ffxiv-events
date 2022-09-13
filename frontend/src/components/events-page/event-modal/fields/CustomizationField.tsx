import { Button, Text } from "@chakra-ui/react";
import { EventModalFieldProps } from "../../../../types/EventModalFieldProps";
import { EVENT_PALETTES } from "../../../../types/EventPalette";

interface CustomizationFieldProps extends EventModalFieldProps {
  palette: string;
  setPalette: (palette: string) => void;
}

const CustomizationField = (customizationFieldProps: CustomizationFieldProps) => {
  const { isEditable, palette, setPalette } = customizationFieldProps;

  const eventPalette = EVENT_PALETTES[palette];

  const nextPaletteIndex = Object.keys(EVENT_PALETTES).findIndex((eventPaletteName) => eventPaletteName === palette) + 1;
  const correctedNextPaletteIndex = nextPaletteIndex >= Object.keys(EVENT_PALETTES).length ? 0 : nextPaletteIndex;
  const nextPalette = Object.keys(EVENT_PALETTES)[correctedNextPaletteIndex];

  return (
    <>
      {isEditable &&
        <Button
          aria-label="Night Mode"
          colorScheme={eventPalette.colorScheme}
          onClick={() => setPalette(nextPalette)}
        >
          {eventPalette.emoji}

          <Text
            ml={2}
          >
            {eventPalette.name}
          </Text>
        </Button>
      }
    </>
  );
};

export default CustomizationField;
