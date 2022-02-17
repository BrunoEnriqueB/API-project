import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { prismaClient } from '../../database/prismaClient';

import { sendEmailForPassword } from '../../helpers/sendEmail';

import createToken from '../../services/createToken';
import getToken from '../../services/getToken';
import getUserDataWithToken from '../../services/getUserDataWithToken';
export class ForgotPasswordController {
  static async forgotpassword(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(422).json({ message: "Insira o email!" })
    }

    const user = await prismaClient.user.findUnique({ where: { email: email } });

    if (!user) {
      return res.status(422).json({ message: "Email inválido!" });
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

      await prismaClient.passwordCode.upsert({
        where: {
          id_user: user.id
        },
        update: {
          code,
          expiresIn
        },
        create: {
          code,
          id_user: user!.id,
          id: emailData!.messageId,
          expiresIn
        }
      });

      return res.status(200).json({ email, message: "Código enviado!" })
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    const { code, email } = req.body;

    if (!code) {
      return res.status(422).json({ message: "Digite o código!" });
    }

    try {
      const user = await prismaClient.user.findUnique({ where: { email: email } });
      if (!user) {
        return res.status(400).json({ message: "Email não encontrado!" })
      }

      const userCode = await prismaClient.passwordCode.findUnique({ where: { id_user: user.id } });

      if (userCode?.code !== code) {
        return res.status(401).json({ message: "Código inválido!" });
      }
      const expiresIn = new Date;
      expiresIn.setHours(expiresIn.getHours())

      if (expiresIn > userCode!.expiresIn) {
        return res.status(401).json({ message: "Código expirado!" });
      }

      return createToken(user, req, res);
    } catch (error) {
      return res.status(400).json({ message: "Algo falhou!" });
    }


  }

  static async sendNewPassword(req: Request, res: Response) {
    const token = getToken(req);

    if (!token) {
      return res.status(422).json({ message: "Não autenticado!" });
    }

    const { password, confirmpassword } = req.body;

    if (!password) {
      return res.status(401).json({ message: "Digite a senha!" });
    }
    if (!confirmpassword) {
      return res.status(401).json({ message: "Digite o confirmação de senha!" });
    }

    if (password !== confirmpassword) {
      return res.status(401).json({ message: "Senhas não compativeis" });
    }

    const user = await getUserDataWithToken(token);
    const hashPassword = await bcrypt.hash(password, 12);

    let email: string;
    Object.keys(user).forEach((key, index) => {
      if (key === 'email') {
        email = Object.values(user)[index];
      }
    })
    try {
      await prismaClient.user.update({
        where: {
          email: email!
        },
        data: {
          password: hashPassword
        }
      });

      return res.status(200).json({ message: "Senha atualizada com sucesso!" })
    } catch (error) {
      return res.status(422).json({ message: "Não foi possivel mudar a senha!" })
    }
  }
}