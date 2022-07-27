import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { generateJWT } from "../utils/authUtil";
import { rateLimitMiddleware } from "../utils/rateLimitUtil";

const TOKEN_EXPIRATION = 1000 * 60 * 30; // 30 minutes

const router = Router();
const prisma = new PrismaClient();

router.post("/v1/authenticate", rateLimitMiddleware, async (req, res) => {
  const { email, token } = req.body;
  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }
  if (!token) {
    return res.status(400).json({ msg: "Token is required" });
  }
  const user = await prisma.user.findUnique({
    where: { email },
    include: { UserTokens: true },
  });
  if (!user) {
    return res.status(400).json({ msg: "Invalid email address" });
  }
  const userToken = user.UserTokens.find((t) => t.token === token);
  if (!userToken) {
    return res.status(400).json({ msg: "Invalid token" });
  }

  if (userToken.createdAt.getTime() + TOKEN_EXPIRATION < Date.now()) {
    await prisma.userToken.delete({ where: { id: userToken.id } });
    return res.status(400).json({ msg: "Token has expired" });
  }

  await prisma.userToken.delete({ where: { id: userToken.id } }); // delete the token after it has been used

  const jwt = generateJWT(user.id);
  return res
    .cookie("Authorization", `${jwt}`, { httpOnly: true })
    .sendStatus(200);
});

export default router;
