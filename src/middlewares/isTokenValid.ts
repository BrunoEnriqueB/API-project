import { NextFunction, Request, Response } from 'express';
import getToken from '../services/getToken';
import jwt from 'jsonwebtoken';

export default async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated!' });
  }

  try {
    jwt.verify(token!, process.env.JWT_SECRET!);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token!' });
  }
}
