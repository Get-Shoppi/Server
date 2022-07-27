import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../utils/authUtil";
import { rateLimitMiddleware } from "../utils/rateLimitUtil";

const router = Router();

const prisma = new PrismaClient();

router.post(
  "/v1/invite-user-to-list",
  rateLimitMiddleware,
  authMiddleware,
  async (req, res) => {
    const { listId, email } = req.body;

    if (!listId) {
      return res.status(400).json({
        error: "Missing listId",
      });
    }

    if (!email) {
      return res.status(400).json({
        error: "Missing email",
      });
    }

    // the user that is being invited
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        acceptInvites: true,
        email: true,
      },
    });

    if (!user || !user.acceptInvites) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const list = await prisma.list.findUnique({
      where: {
        id: listId,
      },
      select: {
        id: true,
        UserOnList: {
          select: {
            userId: true,
          },
        },
        invites: {
          select: {
            inviteeId: true,
          }
        }
      },
    });

    if (!list) {
      return res.status(400).json({
        error: "List not found",
      });
    }

    const inviterOnList = await prisma.userOnList.findUnique({
      where: {
        userId_listId: {
          userId: req.userId!,
          listId,
        },
      },
    });

    // make sure inviter is on the list
    if (!inviterOnList) {
      return res.status(400).json({
        error: "List not found",
      });
    }

    // make sure user is not already on the list
    const userOnList = await prisma.userOnList.findUnique({
      where: {
        userId_listId: {
          userId: user.id,
          listId,
        },
      },
    });

    if (userOnList) {
      return res.status(400).json({
        error: "User is already on list",
      });
    }

    // contains the userId if the user is already invited or nothing if they were not invited yet
    const userInvite = list.invites.filter((invite) => invite.inviteeId === user.id);

    // make sure user is not already invited to the list
    if (userInvite.length > 0) {
      return res.status(400).json({
        error: "User is already invited to list",
      });
    }

    // create the invite
    await prisma.listInvite.create({
      data: {
        list: {
          connect: {
            id: listId,
          },
        },
        inviteeId: user.id,
        inviter: {
          connect: {
            id: req.userId!,
          },
        },
      },
    });

    return res.sendStatus(200);
  }
);

export default router;
