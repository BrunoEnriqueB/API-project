import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import createToken from '../../services/createToken';
import { prismaClient } from '../../database/prismaClient';

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: 'Missing parameter' });
    }

    const user = await prismaClient.user.findUnique({ where: { email } });
    if (user) {
      try {
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return res.status(401).json({ message: 'Invalid password' });
        }
        const token = createToken(user);
        return res.status(200).json({ token });
      } catch (error) {
        return res.status(400).json({ message: error });
      }
    } else {
      return res.status(401).json({ message: 'User not found' });
    }
  }

  static async register(req: Request, res: Response) {
    const { name, email, phone, password, confirmpassword } = req.body;

    if (!name || !email || !phone || !password || !confirmpassword) {
      return res.status(401).json({ message: 'Missing parameter' });
    }
    if (password !== confirmpassword) {
      return res.status(401).json({ message: "Passwords don't match" });
    }

    const existsUser = await prismaClient.user.findUnique({ where: { email } });

    if (existsUser) {
      return res.status(422).json({ message: 'Account already exists!' });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    try {
      const user = await prismaClient.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          phone,
        },
      });

      const token = createToken(user);
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
}
