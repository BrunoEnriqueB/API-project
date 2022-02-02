import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { userTokenData } from '../domain/user';
import { userToDb } from '../domain/user'

export default function createToken(user: userTokenData, req: Request, res: Response) {
  const token = jwt.sign({
    email: user.email,
    id: user.id
  }, process.env.JWT_SECRET!);


  res.status(200).json({
    token: token,
  })
}
