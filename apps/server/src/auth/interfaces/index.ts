import { Role } from '@repo/db';

export interface Payload {
  userId: number;
  role: Role;
}
