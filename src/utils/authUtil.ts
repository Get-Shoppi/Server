import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateJWT(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });
}

export function validateJWT(token: string) {
  const content = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  return content.userId;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cookie = req.headers.cookie
    ?.split(";")
    .find((cookie) => cookie.startsWith("Authorization="));
  if (!cookie) return res.sendStatus(401);
  if (cookie === 'Authorization=') return res.sendStatus(401); // filter out logged out users
  const userId = validateJWT(cookie.split("=")[1]);
  if (!userId) return res.sendStatus(401);
  req.userId = userId;
  next();
}
