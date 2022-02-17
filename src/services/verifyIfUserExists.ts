import { User } from "@prisma/client";
import { Response } from "express";
import { prismaClient } from "../database/prismaClient";



export default async function verifyIfUserExists(res: Response, email?:string, id?: string, ) {
  const user = await prismaClient.user.findUnique({where: {email: email, id: id}});
  if(!user) {
    return res.status(401).json({message: 'Usuário não encontrado!'})
  }
  return (user as User);
}