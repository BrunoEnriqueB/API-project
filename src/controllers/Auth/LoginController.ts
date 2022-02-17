import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import createToken from '../../services/createToken';
import verifyIfUserExists from '../../services/verifyIfUserExists';
import { User } from '@prisma/client';
import { userTokenData } from '../../domain/user';

export class LoginController {
  static async login (req: Request, res: Response) {
    const { email, password } = req.body;

    if(!email) {
      return res.status(401).json({message: "Digite o email!"});
    }
    if(!password) {
      return res.status(401).json({message: "Digite a senha!"});
    }

    try {
      const user = await verifyIfUserExists(res, email);
      const passwordsMatch = await bcrypt.compare(password, (user as User).password);


      if(!passwordsMatch) {
        return res.status(401).json({message: "Senha inválida!"});
      }
      
      return createToken((user as userTokenData), req, res);
    } catch (error) {
      return res.json({message: error});
    }

    
  }
}