import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import { randomBytes } from "crypto";
import { sendLoginMail } from "../utils/mailUtil";

const router = Router();

const prisma = new PrismaClient();

router.post("/v1/login", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ msg: "Invalid email address" });
  }
  const token = randomBytes(32).toString("hex");
  await prisma.user.update({
    where: { id: user.id },
    data: {
      UserTokens: {
        create: {
          token,
        },
      },
    },
  });
  await sendLoginMail(user.email, token);
  return res.sendStatus(200);
});

export default router;
