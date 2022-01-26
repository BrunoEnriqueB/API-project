import { Request, Response } from 'express';
import { prismaClient } from '../../database/prismaClient';
import bcrypt from 'bcrypt';
import createToken from '../../middlewares/createToken';

export class RegisterController {
  static async register (req: Request, res: Response) {
    const { name, email, phone, password, confirmpassword } = req.body;

    if(!name) {
      return res.status(401).json({message: "Digite o nome de usuário!"});
    }
    if(!email) {
      return res.status(401).json({message: "Digite o email!"});
    }
    if(!phone) {
      return res.status(401).json({message: "Digite o número de telefone!"});
    }
    if(!password) {
      return res.status(401).json({message: "Digite a senha!"});
    }
    if(!confirmpassword) {
      return res.status(401).json({message: "Digite o confirmação de senha!"});
    }
    if(password !== confirmpassword) {
      return res.status(401).json({message: "As senhas não conferem!"});
    }

    const userExist = await prismaClient.user.findUnique({where: {email}});
    
    if(userExist) {
      return res.status(422).json({message: "Já existe uma conta com este email!"});
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    try {
      const user = await prismaClient.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          phone
        }
      });

      createToken(user, req, res);
    } catch (error) {
      console.log(error);
    }

    
  }
}