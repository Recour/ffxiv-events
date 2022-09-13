interface FieldStyles {
  color: string;
  bgColor: string;
  borderColor: string;
  focusBorderColor: string;
  _placeholder: {
    color: string;
  }
}

export interface EventPalette {
  name: string;
  emoji: string;
  eventBgColor: string;
  colorScheme: string;
  buttonColorScheme: string;
  fieldStyles: FieldStyles;
  nestedFieldStyles: FieldStyles;
  addonStyles: FieldStyles;
}

export const EVENT_PALETTE_NAMES = {
  WHITE: "white",
  BLACK: "black",
  YELLOW: "yellow",
  PINK: "pink"
};

export const EVENT_PALETTES: { [key: string]: EventPalette } = {
  [EVENT_PALETTE_NAMES.WHITE]:
  {
    name: "Light",
    emoji: "💡",
    eventBgColor: "white",
    colorScheme: "blackAlpha",
    buttonColorScheme: "blackAlpha",
    fieldStyles: {
      color: "gray.900",
      bgColor: "gray.100",
      borderColor: "gray.100",
      focusBorderColor: "gray.900",
      _placeholder: {
        color: "gray.400"
      },
    },
    nestedFieldStyles: {
      color: "gray.900",
      bgColor: "gray.200",
      borderColor: "gray.100",
      focusBorderColor: "gray.900",
      _placeholder: {
        color: "gray.400"
      },
    },
    addonStyles: {
      color: "gray.400",
      bgColor: "gray.200",
      borderColor: "gray.100",
      focusBorderColor: "gray.900",
      _placeholder: {
        color: "gray.400"
      },
    }
  },
  [EVENT_PALETTE_NAMES.BLACK]: {
    name: "Dark",
    emoji: "🔦",
    eventBgColor: "gray.900",
    colorScheme: "whiteAlpha",
    buttonColorScheme: "whiteAlpha",
    fieldStyles: {
      color: "gray.300",
      bgColor: "gray.700",
      borderColor: "gray.700",
      focusBorderColor: "gray.900",
      _placeholder: {
        color: "gray.500"
      },
    },
    nestedFieldStyles: {
      color: "gray.300",
      bgColor: "gray.800",
      borderColor: "gray.700",
      focusBorderColor: "gray.900",
      _placeholder: {
        color: "gray.500"
      },
    },
    addonStyles: {
      color: "gray.500",
      bgColor: "gray.600",
      borderColor: "gray.700",
      focusBorderColor: "gray.900",
      _placeholder: {
        color: "gray.500"
      },
    }
  },
  [EVENT_PALETTE_NAMES.YELLOW]: {
    name: "Buzzy",
    emoji: "🐝",
    eventBgColor: "gray.900",
    colorScheme: "yellow",
    buttonColorScheme: "whiteAlpha",
    fieldStyles: {
      color: "yellow.700",
      bgColor: "yellow.200",
      borderColor: "yellow.200",
      focusBorderColor: "yellow.500",
      _placeholder: {
        color: "yellow.500"
      },
    },
    nestedFieldStyles: {
      color: "yellow.700",
      bgColor: "yellow.100",
      borderColor: "yellow.200",
      focusBorderColor: "yellow.500",
      _placeholder: {
        color: "yellow.500"
      },
    },
    addonStyles: {
      color: "yellow.500",
      bgColor: "yellow.100",
      borderColor: "yellow.200",
      focusBorderColor: "yellow.500",
      _placeholder: {
        color: "yellow.500"
      },
    }
  },
  [EVENT_PALETTE_NAMES.PINK]: {
    name: "UwU",
    emoji: "🌸",
    eventBgColor: "pink",
    colorScheme: "pink",
    buttonColorScheme: "blackAlpha",
    fieldStyles: {
      color: "pink.500",
      bgColor: "pink.200",
      borderColor: "pink.200",
      focusBorderColor: "pink.500",
      _placeholder: {
        color: "pink.400"
      },
    },
    nestedFieldStyles: {
      color: "pink.500",
      bgColor: "pink.100",
      borderColor: "pink.200",
      focusBorderColor: "pink.500",
      _placeholder: {
        color: "pink.400"
      },
    },
    addonStyles: {
      color: "pink.300",
      bgColor: "pink.100",
      borderColor: "pink.200",
      focusBorderColor: "pink.500",
      _placeholder: {
        color: "pink.400"
      },
    }
  }
};
