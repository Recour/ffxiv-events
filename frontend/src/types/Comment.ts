import { User } from "./User";

export interface NewComment {
  text: string;
};

export interface Comment extends NewComment {
  id: string;
  createdAt: Date;
  user: User;
};
