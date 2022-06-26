import { User } from '@prisma/client';
import { Response } from 'express';
import { prismaClient } from '../database/prismaClient';

export default async function verifyIfUserExists(
  email?: string,
  id?: string
): Promise<Response<any, Record<string, any>> | User> {
  const user = await prismaClient.user.findUnique({
    where: { email: email, id: id },
  });
  if (!user) {
  }
  return user as User;
}
