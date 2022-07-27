import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../utils/authUtil";

const router = Router();

const prisma = new PrismaClient();

router.post("/v1/accept-invite", authMiddleware, async (req, res) => {
  const { inviteId } = req.body;

  if (!inviteId) {
    return res.status(400).json({
      error: "Missing inviteId",
    });
  }

  const invite = await prisma.listInvite.findUnique({
    where: {
      id: inviteId,
    },
  });

  if (!invite) {
    return res.status(404).json({
      error: "Invite not found",
    });
  }

  if (invite.inviteeId !== req.userId) {
    return res.status(404).json({
      error: "Invite not found",
    });
  }

  const list = await prisma.list.findUnique({
    where: {
      id: invite.listId,
    },
  });

  if (!list) {
    await prisma.listInvite.delete({ where: { id: inviteId } });
    return res.status(404).json({
      error: "The list does no longer exist",
    });
  }

  await prisma.userOnList.create({
    data: {
      list: {
        connect: {
          id: list.id,
        },
      },
      user: {
        connect: {
          id: req.userId!,
        },
      },
    },
  });

  await prisma.listInvite.delete({ where: { id: inviteId } });

  return res.sendStatus(200);
});

export default router;
