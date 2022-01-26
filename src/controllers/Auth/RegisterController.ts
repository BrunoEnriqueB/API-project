import { Request, Response } from 'express';

export class RegisterController {
  static async register (req: Request, res: Response) {
    return res.json({message: "Rota de registro!"});
  }

}