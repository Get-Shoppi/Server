import { Prisma, PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../utils/authUtil";

const router = Router();

const prisma = new PrismaClient();

router.get("/v1/get-all-lists", authMiddleware, async (req, res) => {
  const lists = await prisma.list.findMany({
    where: {
      UserOnList: {
        some: {
          userId: req.userId!,
        },
      },
    },
  });

  return res.json({ lists });
});

export default router;
