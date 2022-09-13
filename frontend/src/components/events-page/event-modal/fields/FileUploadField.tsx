import { DeleteIcon } from "@chakra-ui/icons";
import { InputGroup, InputLeftElement, Icon, Input, InputRightElement, IconButton } from "@chakra-ui/react";
import { useRef } from "react";
import { MdFileUpload } from "@react-icons/all-files/md/MdFileUpload"
import { EventPalette } from "../../../../types/EventPalette";

interface FileUploadFieldProps {
  eventPalette: EventPalette;
  placeholder: string;
  acceptedFileTypes: string;
  file: File | null;
  setFile: (value: File | null) => void;
}

const FileUploadField = (fileUploadFieldProps: FileUploadFieldProps) => {
  const { eventPalette, placeholder, acceptedFileTypes, file, setFile } = fileUploadFieldProps
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
      >
        <Icon
          as={MdFileUpload}
          color={eventPalette.fieldStyles.color}
        />
      </InputLeftElement>

      <input
        type='file'
        onChange={(e) => e.target.files && e.target.files.length && setFile(e.target.files[0])}
        accept={acceptedFileTypes}
        ref={inputRef}
        style={{ display: 'none' }}
      />

      <Input
        textOverflow="ellipsis"
        placeholder={placeholder}
        onClick={() => inputRef.current.click()}
        readOnly={true}
        value={(file && file.name) || ''}
        {...eventPalette.fieldStyles}
      />

      <InputRightElement
        as={IconButton}
        icon={<DeleteIcon />}
        variant="ghost"
        hidden={!file}
        m={1}
        height="80%"
        colorScheme="blackAlpha"
        onClick={() => setFile(null)}
      />
    </InputGroup>
  );
};

export default FileUploadField;
