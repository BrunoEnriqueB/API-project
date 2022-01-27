import { Request, Response } from 'express';
import { prismaClient } from '../../database/prismaClient';
import { sendEmailForPassword } from '../../helpers/sendEmail';

export class ForgotPasswordController {
  static async forgotpassword(req: Request, res: Response) {
    const { email } = req.body;

    if(!email) {
      res.status(422).json({message: "Insira o email!"})
    }

    const user = await prismaClient.user.findUnique({where: {email: email}});

    if(!user) {
      res.status(422).json({message: "Email não encontrado!"});
    }

    let code = '';
    let caracteres = '0123456789';
    for (let i = 0; i < 5; i++) {
        code += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    try {
      const emailData = await sendEmailForPassword(user!, code);

      const expiresIn = new Date();
      expiresIn.setHours(expiresIn.getHours() + 1);

      await prismaClient.passwordCode.create({
        data: {
          code: code,
          id_user: user!.id,
          id: emailData.messageId,
          expiresIn
        }
      });

      return res.json({message: "Código enviado!"});
    } catch (error) {
      console.log(error);
      return res.json({message: error});
    }
  }
}