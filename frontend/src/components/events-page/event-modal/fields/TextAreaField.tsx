import { Box, Text, Textarea } from "@chakra-ui/react";
import { COLORS } from "../../../../styles/theme";
import { EventModalFieldProps } from "../../../../types/EventModalFieldProps";
import { marked } from "marked";

interface TextAreaFieldProps extends EventModalFieldProps {
  value: string;
  setValue: (value: string) => void;
}

const TextAreaField = (textAreaFieldProps: TextAreaFieldProps) => {
  const { isEditable, value, setValue } = textAreaFieldProps;

  if (isEditable) {
    return (
      <Textarea
        value={value}
        placeholder="Enter description"
        onChange={(e) => setValue(e.target.value)}
        focusBorderColor={COLORS.GREY_NORMAL}
      />
    );
  } else {
    return (
      <Box
        mt={3}
        p={3}
        borderWidth="1px"
        borderRadius="lg"
      >
        <Text
          dangerouslySetInnerHTML={{ __html: marked.parse(value) }}
          fontSize="sm"
        />
      </Box>
    );
  }
};

export default TextAreaField;
