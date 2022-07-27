import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../utils/authUtil";

const router = Router();

const prisma = new PrismaClient();

router.post("/v1/remove-item-from-list", authMiddleware, async (req, res) => {
  const { item, listId } = req.body;
  if (!item || !listId) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  const list = await prisma.list.findUnique({
    where: {
      id: listId,
    },
    include: {
      UserOnList: {
        select: {
          userId: true,
        },
      },
    },
  });
  if (!list) {
    return res.status(404).json({
      error: "List not found",
    });
  }

  const user = list.UserOnList.find((u) => u.userId === req.userId);
  if (!user) {
    return res.status(404).json({
      error: "List not found",
    });
  }

  const modifiedItems = list.items.filter((i) => i !== item);

  const modifiedList = await prisma.list.update({
    where: {
      id: listId,
    },
    data: {
      items: {
        set: modifiedItems,
      },
    },
  });

  return res.status(200).json({ list: modifiedList });
});

export default router;
