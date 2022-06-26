import { JwtPayload } from 'jsonwebtoken';

export interface userData {
  email: string;
  id: string;
}
export interface userToDb {
  email: string;
  id: string;
  iat: number;
}
