import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { response } from 'express';
import { userData } from '../domain/user';

export default async function getUserDataWithToken(token: string): Promise<userData> {
  const doneToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
  return doneToken;

}