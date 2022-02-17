import { Request } from 'express';

export default function getToken(req: Request) {
  const authHeader = req.headers.authorization;
  return authHeader?.split(' ')[1];
}