import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { Request, response } from 'express';
import { userData } from '../domain/user';
import getToken from './getToken';

export default async function getUserDataWithToken(
  req: Request
): Promise<userData | undefined> {
  const token = getToken(req);
  if (!token) {
    return;
  }

  try {
    const userTokenData = jsonwebtoken.verify(
      token,
      `${process.env.JWT_SECRET}`
    );
    return userTokenData as userData;
  } catch (error) {
    console.log(error);
  }
}
