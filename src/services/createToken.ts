import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { userData } from '../domain/user';

export default function createToken(
  user: userData,
  req: Request,
  res: Response
) {
  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
    },
    process.env.JWT_SECRET!
  );
  res.status(200).json({
    token,
  });
}
