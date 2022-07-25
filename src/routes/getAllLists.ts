import { Prisma, PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../utils/authUtil";

const router = Router();

router.use(authMiddleware);

const prisma = new PrismaClient();

const listSelect = Prisma.validator<Prisma.UserSelect>()({
  UserOnList: {
    include: {
      list: {
        select: {
          id: true,
          name: true,
          updatedAt: true,
          items: true
        }
      }
    }
  }
});

router.get("/v1/get-all-lists", async (req, res) => {
  const lists = await prisma.list.findMany({
    where: {
      UserOnList: {
        every: {
          userId: req.userId
        }
      }
    }
  })

  return res.json({ lists });
});

export default router;
