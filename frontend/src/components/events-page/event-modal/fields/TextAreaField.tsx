import { Box, ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import { EventModalFieldProps } from "../../../../types/EventModalFieldProps";
import MDEditor from '@uiw/react-md-editor';
import { EventPalette } from "../../../../types/EventPalette";

interface TextAreaFieldProps extends EventModalFieldProps {
  eventPalette: EventPalette;
  value: string;
  setValue: (value: string) => void;
}

const TextAreaField = (textAreaFieldProps: TextAreaFieldProps) => {
  const { isEditable, eventPalette, value, setValue } = textAreaFieldProps;

  const mdEditorTheme = extendTheme({
    styles: {
      global: {
        ".w-md-editor": {
          "color": eventPalette.fieldStyles.color,
          "backgroundColor": eventPalette.fieldStyles.bgColor,
          "boxShadow": "none",
          ".w-md-editor-toolbar-divider": {
            "backgroundColor": eventPalette.fieldStyles.color
          }
        },
        ".w-md-editor-toolbar": {
          "borderBottom": "none",
          "li > button": {
            "color": eventPalette.fieldStyles.color,
            ":hover": {
              "color": eventPalette.fieldStyles.color,
            }
          },
          "li.active > button": {
            "color": eventPalette.fieldStyles.color
          },
          "backgroundColor": eventPalette.addonStyles.bgColor
        },
        ".wmde-markdown": {
          "color": eventPalette.fieldStyles.color,
          "backgroundColor": eventPalette.fieldStyles.bgColor
        },
        ".w-md-editor-preview": {
          "boxShadow": "none"
        },
        "::-webkit-calendar-picker-indicator": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="${eventPalette.eventBgColor}" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>')`
        }
      }
    },
  });

  if (isEditable) {
    return (
      <Flex direction="column">
        <Box
          className="container"
          borderWidth={1}
          borderRadius="lg"
          {...eventPalette.fieldStyles}
        >
          <ChakraProvider
            theme={mdEditorTheme}
          >
            <MDEditor
              value={value}
              onChange={(value) => value ? setValue(value) : setValue("")}
            />
          </ChakraProvider>
        </Box>


      </Flex>
    );
  } else {
    return (
      <Box
        data-color-mode="light"
        mt={3}
        p={3}
        borderWidth={1}
        borderRadius="lg"
        {...eventPalette.fieldStyles}
      >
        <ChakraProvider
          theme={mdEditorTheme}
        >
          <MDEditor.Markdown
            source={value}
            style={{ whiteSpace: 'pre-wrap' }}
          />
        </ChakraProvider>
      </Box>
    );
  }
};

export default TextAreaField;
