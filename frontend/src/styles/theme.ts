import { extendTheme } from '@chakra-ui/react';
import './apple-scrollbar.css';

export const COLORS = {
  GREY_DARK: "gray.900",
  GREY_NORMAL: "gray.500",
  GREY_LIGHT: "gray.100",
  RED_DARK: "red.900,",
  RED_NORMAL: "red.500",
  RED_LIGHT: "red.100",
  BLUE_DARK: "blue.900",
  BLUE_NORMAL: "blue.500",
  BLUE_LIGHT: "blue.100",
  GREEN_DARK: "green.900",
  GREEN_NORMAL: "green.500",
  GREEN_LIGHT: "green.100",
  TEAL_DARK: "teal.900",
  TEAL_NORMAL: "teal.500",
  TEAL_LIGHT: "teal.100",
  WHITE: "white"
};

export const theme = extendTheme({
  styles: {
    global: {
      ".js-focus-visible :focus:not([data-focus-visible-added])": {
        "outline": "none",
        "boxShadow": "none"
      }
    }
  },
});
