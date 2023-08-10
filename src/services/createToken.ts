import jwt from 'jsonwebtoken';
import { userData } from '../domain/user';

export default function createToken(user: userData) {
  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
    },
    process.env.JWT_SECRET!
  );
  return token;
}
