import { LockIcon } from "@chakra-ui/icons";
import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SetStateAction, useRef, useState } from "react";
import { createComment } from "../../../../database/comments";
import { Event } from "../../../../types/Event";
import { User } from "../../../../types/User";
import { useDimensions } from '@chakra-ui/react'
import { COLORS } from "../../../../styles/theme";

const MAX_COMMENT_LENGTH = 280;

interface CommentFieldProps {
  user: User | null;
  eventId: string;
  setEvent: React.Dispatch<SetStateAction<Event | null>>;
};

const CommentField = (commentFieldProps: CommentFieldProps) => {
  const { user, eventId, setEvent } = commentFieldProps;
  const buttonRef = useRef<HTMLElement>() as React.MutableRefObject<HTMLButtonElement>;
  const buttonDimensions = useDimensions(buttonRef);

  const [text, setText] = useState<string>("");
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const handleChange = (text: string) => {
    if (text.length <= MAX_COMMENT_LENGTH) {
      setText(text);
    }
  };

  const handlePost = async () => {
    const newComment = {
      text
    };

    setIsPosting(true);

    const updatedEvent = await createComment(eventId, newComment);
    setEvent(updatedEvent);

    setText("");
    setIsPosting(false);
  };

  return (
    <InputGroup>
      <Input
        pr={`${buttonDimensions?.marginBox.width}px`}
        isDisabled={!user}
        focusBorderColor={COLORS.GREY_NORMAL}
        placeholder="Add a comment"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
      />

      <InputRightElement
        width="fit-content"
      >
        <Button
          ref={buttonRef}
          isDisabled={!text}
          isLoading={isPosting}
          loadingText="Posting"
          colorScheme={user ? "blackAlpha" : "gray"}
          leftIcon={user ? undefined : <LockIcon />}
          size="sm"
          m={1}
          onClick={handlePost}
        >
          {user ? "Comment" : "Sign in"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default CommentField;
