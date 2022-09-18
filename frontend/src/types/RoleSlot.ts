import { User } from "./User";

export interface NewRoleSlot {
  jobId: number | null;
  isOpen: boolean;
  guest: User | null;
}

export interface RoleSlot extends NewRoleSlot {
  id: string;
}
