import getToken from '../services/getToken';
import { prismaClient } from '../database/prismaClient';
import { NextFunction, Request, Response } from 'express';
import getUserDataWithToken from '../services/getUserDataWithToken';

export default async function verifySuperUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.headers.authorization) {
    const token = getToken(req);
    const userData = await getUserDataWithToken(token!);

    if (userData) {
      const user = await prismaClient.user.findUnique({
        where: { email: userData.email },
      });
      if (user) {
        if (user.userType === 'ADMIN') {
          next();
        } else {
          return res.status(403).json({ message: 'Você não tem autorização!' });
        }
      }
    }
  } else {
    return res.status(401).json({ message: 'Sem token!' });
  }
}
