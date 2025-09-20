// src/middleware/auth.middleware.ts
import { Context, Next } from "hono";

export const gatewayAuthMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("X-Gateway-Auth");
  const expectedSecret = c.env.GATEWAY_SECRET;

  if (!authHeader || authHeader !== expectedSecret) {
    console.error("Unauthorized access desde middleware");
    return c.json(
      {
        error: "Unauthorized from gateway secret",
      },
      401
    );
  }

  await next();
};
