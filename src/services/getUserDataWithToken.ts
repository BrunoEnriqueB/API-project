import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { response } from 'express';
import { userData } from '../domain/user';

export default async function getUserDataWithToken(token: string) {
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
