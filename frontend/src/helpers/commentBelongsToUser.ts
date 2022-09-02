import { Comment } from "../types/Comment";
import { User } from "../types/User";

export const commentBelongsToUser = (user: User, comment: Comment) => {
  return comment.user.id === user.id;
};
