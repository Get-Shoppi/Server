import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { generateJWT } from "../utils/authUtil";

const router = Router();
const prisma = new PrismaClient();
//FIXME: once a token has been used successfully it should be removed from the database
//TODO: tokens should expire after a certain amount of time
router.post("/v1/authenticate", async (req, res) => {
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
  const jwt = generateJWT(user.id);
  return res
    .cookie("Authorization", `${jwt}`, { httpOnly: true })
    .sendStatus(200);
});

export default router;
