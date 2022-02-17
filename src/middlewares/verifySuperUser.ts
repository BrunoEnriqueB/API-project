import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { userTokenData } from "../domain/user";
import createToken from "../services/createToken";
import getToken from "../services/getToken";
import getUserDataWithToken from "../services/getUserDataWithToken";
import verifyIfUserExists from "../services/verifyIfUserExists";

export default async function verifySuperUser(req: Request, res: Response, next: NextFunction) {
  if(req.headers.authorization) {
    const token = getToken(req);
    const user = await getUserDataWithToken(token!).then().catch((error) => {
      return res.status(401).json({message: "Houve um erro ao válidar o token!"})
    });
    const userData = await verifyIfUserExists(res, undefined,(user as userTokenData).id);

    if((userData as User).usertype === 'superuser') {
      next();
    } else {
      return res.status(403).json({message: "Você não tem autorização!"});  
    }
  } else {
    return res.status(401).json({message: "Sem token!"});
  }
}