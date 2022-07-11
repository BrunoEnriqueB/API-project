import bcrypt from 'bcrypt';

import { Request, Response } from 'express';

import { prismaClient } from '../../database/prismaClient';

import { sendEmailForPassword } from '../../helpers/sendEmail';

import getToken from '../../services/getToken';
import createToken from '../../services/createToken';
import getUserDataWithToken from '../../services/getUserDataWithToken';
export class ForgotPasswordController {
  static async forgotpassword(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(422).json({ message: 'Missing email' });
    }

    const user = await prismaClient.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(422).json({ message: "User doesn't exists!" });
    }

    let code = '';
    let characters = '0123456789';
    for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    try {
      const emailData = await sendEmailForPassword(user, code);

      const expiresIn = new Date();
      expiresIn.setHours(expiresIn.getHours() + 1);

      await prismaClient.passwordCode.upsert({
        where: {
          id_user: user.id,
        },
        update: {
          code,
          expiresIn,
        },
        create: {
          id: emailData!.messageId,
          id_user: user.id,
          code,
          expiresIn,
        },
      });

      return res.status(200).json({ email, message: 'Código enviado!' });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    const { code, email } = req.body;

    if (!code) {
      return res.status(422).json({ message: 'Missing code!' });
    }

    try {
      const user = await prismaClient.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        return res.status(400).json({ message: 'User not found!' });
      }

      const userCode = await prismaClient.passwordCode.findUnique({
        where: { id_user: user.id },
      });

      if (!userCode) {
      }

      const expiresIn = new Date();
      expiresIn.setHours(expiresIn.getHours());

      if (expiresIn > userCode!.expiresIn) {
        return res.status(401).json({ message: 'Código expirado!' });
      }

      const token = createToken(user);
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(400).json({ message: 'Algo falhou!' });
    }
  }

  static async sendNewPassword(req: Request, res: Response) {
    const token = getToken(req);

    if (!token) {
      return res.status(422).json({ message: 'Não autenticado!' });
    }

    const { password, confirmpassword } = req.body;

    if (!password) {
      return res.status(401).json({ message: 'Digite a senha!' });
    }
    if (!confirmpassword) {
      return res
        .status(401)
        .json({ message: 'Digite o confirmação de senha!' });
    }

    if (password !== confirmpassword) {
      return res.status(401).json({ message: 'Senhas não compativeis' });
    }

    const user = await getUserDataWithToken(req);
    const hashPassword = await bcrypt.hash(password, 12);

    let email: string;
    if (user) {
      Object.keys(user).forEach((key, index) => {
        if (key === 'email') {
          email = Object.values(user)[index];
        }
      });
    }

    try {
      await prismaClient.user.update({
        where: {
          email: email!,
        },
        data: {
          password: hashPassword,
        },
      });

      return res.status(200).json({ message: 'Senha atualizada com sucesso!' });
    } catch (error) {
      return res
        .status(422)
        .json({ message: 'Não foi possivel mudar a senha!' });
    }
  }
}
