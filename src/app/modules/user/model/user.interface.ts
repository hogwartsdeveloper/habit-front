export interface IUser {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  img: string;
}

export type CreateUser = Omit<IUser, '_id' | 'img'> & { password: string };
export type AuthUser = Pick<IUser, 'email'> & { password: string };
