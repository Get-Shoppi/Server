import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../utils/authUtil";

const router = Router();

const prisma = new PrismaClient();

router.post("/v1/delete-invite-from-list", authMiddleware, async (req, res) => {
  const { inviteId } = req.body;

  if (!inviteId) {
    return res.status(400).json({
      error: "Missing inviteId",
    });
  }

  const usersOnList = await prisma.listInvite.findUnique({
    where: {
      id: inviteId,
    },
    include: {
      list: {
        include: {
          UserOnList: {
            select: {
              userId: true,
            },
          },
        },
      },
    },
  });

  if (!usersOnList) {
    return res.status(400).json({
      error: "Invite not found",
    });
  }

  const usersOnListIds = usersOnList.list.UserOnList.map(
    (userOnList) => userOnList.userId
  );

  if (!usersOnListIds.includes(req.userId!)) {
    return res.status(400).json({
      error: "Invite not found",
    });
  }

  await prisma.listInvite.delete({
    where: {
      id: inviteId,
    },
  });

  return res.sendStatus(200);
});

export default router;
