import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import getUserDataWithToken from '../services/getUserDataWithToken';

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userData = await getUserDataWithToken(req);

  if (userData) {
    const user = await prismaClient.user.findUnique({
      where: { id: userData.id },
    });
    if (user) {
      if (user.authorized) {
        next();
      } else {
        res
          .status(403)
          .json({ message: 'User not authorized, please confirm your email' });
      }
    }
  }
  res.status(200).json({ message: 'Invalid token' });
}
