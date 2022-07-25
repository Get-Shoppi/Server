import { Router, Request, Response } from "express";

const router = Router();

router.get("/v1/logout", async (req: Request, res: Response) => {
  return res
    .cookie("Authorization", '', { httpOnly: true })
    .sendStatus(200);
});

export default router;
