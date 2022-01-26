import { Request, Response } from 'express';

export class LoginController {
  static async login (req: Request, res: Response) {
    return res.json({message: "Rota de login!"});
  }

}