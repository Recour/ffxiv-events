import axios from "axios";
import { NewComment } from "../types/Comment";
import { Event } from "../types/Event";

export const createComment = async (eventId: string, comment: NewComment) => {
  try {
    const response = await axios.post('/api/comment', null, {
      params: {
        id: eventId,
        comment
      }
    });

    const updatedEvent: Event = response.data;
    return updatedEvent;
  } catch (e) {
    throw new Error(`Error creating comment: ${eventId}, ${comment}`);
  }
};

export const deleteComment = async (eventId: string, commentId: string) => {
  try {
    const response = await axios.delete('/api/comment', {
      params: {
        eventId,
        commentId
      }
    });

    const updatedEvent: Event = response.data;
    return updatedEvent;
  } catch (e) {
    throw new Error(`Error deleting comment: ${eventId}, ${commentId}`);
  }
};
