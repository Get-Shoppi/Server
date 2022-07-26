import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../utils/authUtil";

const router = Router();

router.use(authMiddleware);

const prisma = new PrismaClient();

router.post("/v1/create-list", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Missing name",
    });
  }

  const listUser = await prisma.userOnList.create({
    data: {
      accepted: true,
      user: {
        connect: {
          id: req.userId,
        },
      },
      list: {
        create: {
          name,
        },
      },
    },
    include: {
      list: true,
    },
  });

  return res.json({ listId: listUser.list.id });
});

export default router;
