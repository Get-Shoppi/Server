import { Router } from "express";
import { getIp, rateLimiter } from "../utils/rateLimitUtil";

const router = Router();

type HealthResponse = {
  status: "ok";
  ip?: string;
  remainingRequests?: number | string;
};

router.get("/v1/health", async (req, res) => {
  const response: HealthResponse = {
    status: "ok",
  };

  const ip = getIp(req);
  if (ip) {
    const rl = await rateLimiter.get(ip);
    response.ip = ip;
    response.remainingRequests = rl?.remainingPoints || "N/A"; // N/A usually means the user hasnt used any points yet
  }
  return res.json(response);
});

export default router;
