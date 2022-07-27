import { NextFunction, Request, Response } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

export function getIp(req: Request) {
  if (process.env.NODE_ENV === "DEV") {
    return '33.249.134.102';
  }
  return req.headers["cf-connecting-ip"] as string | undefined;
}

export const rateLimiter = new RateLimiterMemory({
  points: 6, // 6 requests
  duration: 5, // per 5s
});

export async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = getIp(req);
  if (!ip) {
    return res.status(429).json({ error: "Could not determine request IP" });
  }
  try {
    await Promise.resolve(rateLimiter.consume(ip, 1));
    next();
  } catch (_) {
    rateLimiter.get(ip);
    return res.status(429).json({ error: "Too many requests" });
  }
}
