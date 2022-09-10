import { DeleteIcon } from "@chakra-ui/icons";
import { Avatar, Box, Flex, IconButton, Text, Tooltip } from "@chakra-ui/react";
import moment from "moment";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { deleteComment } from "../../../../database/comments";
import { commentBelongsToUser } from "../../../../helpers/commentBelongsToUser";
import { isHost } from "../../../../helpers/isHost";
import { COLORS } from "../../../../styles/theme";
import { Comment } from "../../../../types/Comment";
import { Event } from "../../../../types/Event";
import { EventPalette } from "../../../../types/EventPalette";
import { User } from "../../../../types/User";
import CommentField from "./CommentField";

interface CommentSectionProps {
  eventPalette: EventPalette;
  user: User | null;
  event: Event;
  setEvent: React.Dispatch<SetStateAction<Event | null>>;
};

const CommentSection = (commentSectionProps: CommentSectionProps) => {
  const { eventPalette, user, event, setEvent } = commentSectionProps;
  const commentsEndRef = useRef<HTMLElement>() as React.MutableRefObject<HTMLDivElement>;

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const userIsHost = user && isHost(user, event);
  const showDeleteIcon = (comment: Comment) => {
    return user && (userIsHost || commentBelongsToUser(user, comment));
  };

  const handleClickDelete = async (commentId: string) => {
    setIsDeleting(commentId);

    const updatedEvent = await deleteComment(event.id, commentId);
    setEvent(updatedEvent);

    setIsDeleting(null);
  };

  useEffect(() => {
    if (event.comments.length) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [event]);

  return (
    <Flex
      direction="column"
      borderWidth={1}
      borderRadius="lg"
      p={3}
      overflow="hidden"
      maxHeight="25vh"
      {...eventPalette.fieldStyles}
    >
      <Box
        overflowY="auto"
      >
        {[...event.comments].reverse().map((comment, index) =>
          <Flex
            direction="row"
            alignItems="center"
            p={{
              base: 2,
              sm: 3
            }}
            mt={index !== 0 ? 2 : 0}
            borderWidth={1}
            borderRadius="lg"
            {...eventPalette.nestedFieldStyles}
            key={index}
          >
            <Flex
              direction="column"
              width="100%"
            >
              <Flex
                direction={{
                  base: "column",
                  sm: "row"
                }}
                justifyContent="space-between"
                alignItems={{
                  base: "flex-start",
                  sm: "center"
                }}
                width="100%"
              >
                <Flex
                  direction="row"
                  alignItems="center"
                >
                  <Avatar size="xs" src={comment.user.photoUrl} />

                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    ml={2}
                  >
                    {comment.user.displayName}
                  </Text>
                </Flex>

                <Flex
                  direction="row"
                  alignItems="center"
                >
                  <Text
                    fontSize="xs"
                    color={COLORS.GREY_NORMAL}
                  >
                    {moment.utc(comment.createdAt).local().fromNow()}
                  </Text>

                  {showDeleteIcon(comment) &&
                    <Tooltip
                      label="Delete comment"
                    >
                      <IconButton
                        icon={<DeleteIcon />}
                        isLoading={isDeleting === comment.id}
                        ml={1}
                        variant="ghost"
                        size="xs"
                        colorScheme={eventPalette.colorScheme}
                        aria-label="Delete comment"
                        onClick={() => handleClickDelete(comment.id)}
                      />
                    </Tooltip>
                  }
                </Flex>
              </Flex>

              <Text
                mt={1}
                fontSize="sm"
              >
                {comment.text}
              </Text>
            </Flex>
          </Flex>
        )}

        <div ref={commentsEndRef} />
      </Box>

      <Box
        mt={event.comments.length ? 2 : 0}
      >
        <CommentField
          eventPalette={eventPalette}
          user={user}
          eventId={event.id}
          setEvent={setEvent}
        />
      </Box>
    </Flex>
  );
};

export default CommentSection;
