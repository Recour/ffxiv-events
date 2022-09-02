import axios from "axios";
import { User } from "../types/User";

export const getUser = async (): Promise<User | null> => {
  const response = await axios.get('/api/user');

  const user: User | null = response.data;
  return user;
};
