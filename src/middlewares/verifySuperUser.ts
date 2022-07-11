import { prismaClient } from '../database/prismaClient';
import { NextFunction, Request, Response } from 'express';
import getUserDataWithToken from '../services/getUserDataWithToken';

export default async function verifySuperUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userData = await getUserDataWithToken(req);
  if (!userData) {
    return res.status(403).json({ message: 'User not found' });
  }

  const user = await prismaClient.user.findUnique({
    where: { email: userData.email },
  });

  if (!user) {
    return res.status(422).json({ message: "User doesn't exists!" });
  }

  if (user.userType !== 'ADMIN') {
    return res
      .status(401)
      .json({ message: 'This user is not allowed to this operation.' });
  }
  next();
}
