import { Router } from "express";
import { authMiddleware } from "../utils/authUtil";

const router = Router();

router.use(authMiddleware);

export default router;
