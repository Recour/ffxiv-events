import { User } from "./User";

export interface RoleSlot {
  jobId: number | null;
  isOpen: boolean;
  guest: User | null;
}
