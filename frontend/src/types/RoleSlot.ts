import { User } from "./User";

export interface RoleSlot {
  id: string;
  jobId: number | null;
  isOpen: boolean;
  guest: User | null;
}
