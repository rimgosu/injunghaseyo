import { UserWithJoinRole } from './types';

export class UserSeedData {
  static users: Record<'admin' | 'user1' | 'user2', UserWithJoinRole> = {
    admin: null,
    user1: null,
    user2: null,
  };
}
