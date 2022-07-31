import { PrismaClient, User } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../utils/authUtil";

const router = Router();

const prisma = new PrismaClient();

interface ListInvite {
  id: string;
  inviter: {
    id: string;
    name: string;
  };
  invitee: {
    id: string;
    email: string;
  };
}

router.post(
  "/v1/get-all-invites-from-list",
  authMiddleware,
  async (req, res) => {
    const { listId } = req.body;

    if (!listId) {
      return res.status(400).json({
        error: "Missing listId",
      });
    }

    const listInvites = await prisma.listInvite.findMany({
      where: {
        listId: listId,
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
        inviter: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!listInvites || listInvites.length === 0) {
      return res.status(200).json({ invites: [] });
    }

    // Returns a list of all user ids that have access to the list
    // we can just use the first invite since they all point to the same list
    const allUsersOnList = listInvites[0].list.UserOnList.map((user) => {
      return user.userId;
    });

    // make sure the user has access to the list
    if (!allUsersOnList.includes(req.userId!)) {
      return res.status(200).json({ invites: [] });
    }

    // fetch all invitees
    const inviteePromises = [];
    const userIdToInviteId: { [inviteId: string]: string } = {}; // this helps us later map the invitee to the invite
    for (const invite of listInvites) {
      userIdToInviteId[invite.inviteeId] = invite.id;
      inviteePromises.push(
        prisma.user.findUnique({
          where: {
            id: invite.inviteeId,
          },
        })
      );
    }
    const invitees = await Promise.allSettled(inviteePromises);

    // combine the data into a list of invites
    const invites: ListInvite[] = [];
    for (const inviteeResult of invitees) {
      if (inviteeResult.status === "rejected") continue;
      const invitee = inviteeResult.value;
      if (!invitee) continue;

      const invite = listInvites.find(
        (invite) => invite.inviteeId === invitee.id
      );
      if (!invite) continue;

      invites.push({
        id: invite.id,
        inviter: {
          id: invite.inviter.id,
          name: invite.inviter.name,
        },
        invitee: {
          id: invitee.id,
          email: invitee.email,
        },
      });
    }

    return res.json({ invites });
  }
);

export default router;
