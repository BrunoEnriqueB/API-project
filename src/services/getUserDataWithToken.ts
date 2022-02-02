import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import getToken from './getToken';
import { Request, response } from 'express';
import { abort } from 'process';

export default async function getUserDataWithToken(token: string) {
  return jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
}