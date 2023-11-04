import { User } from './user';

export type CreateUser = Omit<User, 'id' | 'img'> & { password: string };
export type AuthUser = Pick<User, 'email'> & { password: string };
export type UpdateUser = Pick<User, 'firstName' | 'lastName'>;
export type VerifyEmail = AuthUser & { code: number };
