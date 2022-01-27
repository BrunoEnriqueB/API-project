import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../domain/user';

export default function createToken(user: User, req: Request, res: Response) {
  const token = jwt.sign({
    name: user.name,
    id: user.id
  }, process.env.JWT_SECRET!);


  res.status(200).json({
    message: "Você está autenticado!",
    token: token,
    userId: user.id,
  })
}
