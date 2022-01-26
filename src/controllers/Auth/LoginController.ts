import { Request, Response } from 'express';
import { prismaClient } from '../../database/prismaClient';
import bcrypt from 'bcrypt';
import createToken from '../../middlewares/createToken';
export class LoginController {
  static async login (req: Request, res: Response) {
    const { email, password } = req.body;

    if(!email) {
      return res.status(401).json({message: "Digite o email!"});
    }
    if(!password) {
      return res.status(401).json({message: "Digite a senha!"});
    }

    const user = await prismaClient.user.findUnique({where: {email: email}});

    if(!user) {
      return res.status(401).json({message: "Não existe usuário com este email!"});
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if(!passwordsMatch) {
      return res.status(401).json({message: "Senha inválida!"});
    }

    if(!user.authorized) {
      return res.status(401).json({
        message: "Você não está autorizado! Aguarde autorização do admin",
        user_autorization: user.authorized
      });
    }

    return await createToken(user, req, res);

  }
}