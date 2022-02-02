import jsonwebtoken from 'jsonwebtoken';
import { Request, response } from 'express';

export default function getToken(req: Request) {
  const authHeader = req.headers.authorization;

  return authHeader?.split(' ')[1];
}