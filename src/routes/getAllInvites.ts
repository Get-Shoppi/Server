import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../utils/authUtil";

const router = Router();

const prisma = new PrismaClient();

router.get("/v1/get-all-invites", authMiddleware, async (req, res) => {
  const invites = await prisma.listInvite.findMany({
    where: {
      inviteeId: req.userId!,
    },
    include: {
      list: {
        select: {
          name: true,
        },
      },
      inviter: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  return res.json(invites);
});

export default router;
