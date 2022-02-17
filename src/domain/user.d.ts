import { JwtPayload } from "jsonwebtoken";

export interface userTokenData {
  email: string,
  id: string
}

export type userData = userTokenData | string | JwtPayload

export interface userToDb {
  email: string,
  id: string
  iat: number
}
