import jwt from 'jsonwebtoken';
import { Request, Response } from 'express'

interface User {
  name: string,
  id: string,
  phone?: string,
  password?: string
}

export default function createToken(user: User, req: Request, res: Response) {
  const token = jwt.sign({
    name: user.name,
    id: user.id
  }, "@&#YF$uC:iWu.XI'B`Vf7+]'vAEX0s");

  res.status(200).json({
    message: "Você está autenticado!",
    token: token,
    userId: user.id
  })
}
