import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { Router, Request, Response } from "express";
import { sendLoginMail } from "../utils/mailUtil";
import { rateLimitMiddleware } from "../utils/rateLimitUtil";

const router = Router();

const prisma = new PrismaClient();

router.post(
  "/v1/signup",
  rateLimitMiddleware,
  async (req: Request, res: Response) => {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const token = randomBytes(32).toString("hex");
    await prisma.user.create({
      data: {
        email,
        name,
        UserTokens: {
          create: {
            token,
          },
        },
      },
    });

    await sendLoginMail(email, token);
    return res.sendStatus(200);
  }
);

export default router;
