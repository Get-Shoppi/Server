import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../utils/authUtil";

const router = Router();

const prisma = new PrismaClient();

router.post("/v1/settings", authMiddleware, async (req, res) => {
  const { name, acceptInvites } = req.body;

  if (!name && !acceptInvites) {
    return res.status(400).json({
      error: "Missing name and/or acceptInvites",
    });
  }

  const data: { name?: string; acceptInvites?: boolean } = {};

  if (name) {
    data.name = name;
  }

  if (acceptInvites) {
    if (acceptInvites === "true") data.acceptInvites = true;
    else if (acceptInvites === "false") data.acceptInvites = false;
  }

  const user = await prisma.user.update({
    where: {
      id: req.userId,
    },
    data,
    select: {
      name: true,
      email: true,
      acceptInvites: true,
    },
  });

  return res.json({ user });
});

router.get("/v1/settings", authMiddleware, async (req, res) => {
  const settings = await prisma.user.findUnique({
    where: {
      id: req.userId!,
    },
    select: {
      name: true,
      email: true,
      acceptInvites: true,
    },
  });

  return res.json(settings);
});

export default router;
