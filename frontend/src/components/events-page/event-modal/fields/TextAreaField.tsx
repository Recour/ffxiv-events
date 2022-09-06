import { Box, Flex } from "@chakra-ui/react";
import { EventModalFieldProps } from "../../../../types/EventModalFieldProps";
import MDEditor from '@uiw/react-md-editor';

interface TextAreaFieldProps extends EventModalFieldProps {
  value: string;
  setValue: (value: string) => void;
}

const TextAreaField = (textAreaFieldProps: TextAreaFieldProps) => {
  const { isEditable, value, setValue } = textAreaFieldProps;

  if (isEditable) {
    return (
      <Flex direction="column">
        <Box
          data-color-mode="light"
          className="container"
        >
          <MDEditor
            value={value}
            onChange={(value) => value ? setValue(value) : setValue("")}
          />
        </Box>


      </Flex>
    );
  } else {
    return (
      <Box
        data-color-mode="light"
        mt={3}
        p={3}
        borderWidth="1px"
        borderRadius="lg"
      >
        <MDEditor.Markdown
          source={value}
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </Box>
    );
  }
};

export default TextAreaField;
