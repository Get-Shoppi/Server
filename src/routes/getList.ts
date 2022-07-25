import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../utils/authUtil";

const router = Router();

router.use(authMiddleware);

const prisma = new PrismaClient();

//TODO: might be better to make this a get request (/v1/lists/:id)
router.post("/v1/get-list", async (req, res) => {
  const { listId } = req.body;

  if (!listId) {
    return res.status(400).json({
      error: "Missing listId",
    });
  }

  const userList = await prisma.userOnList.findUnique({
    where: {
      userId_listId: {
        listId: listId,
        userId: req.userId!,
      },
    },
    include: {
      list: true,
    },
  });

  if (!userList) {
    return res.status(404).json({
      error: "List not found",
    });
  }

  return res.json({ list: userList.list });
});

export default router;
