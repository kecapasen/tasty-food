import { SetMetadata } from '@nestjs/common';
import { Role } from '@repo/db';

export const StaffOnly = (...roles: Role[]) => SetMetadata('ROLES', roles);
