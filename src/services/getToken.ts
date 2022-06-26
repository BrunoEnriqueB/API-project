import { Request } from 'express';

export default function getToken(req: Request) {
  if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    return authHeader.split(' ')[1];
  }
}
