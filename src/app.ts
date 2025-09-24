// src/index.ts
import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { Env } from "./config/bindings";
import { paymentRoutes } from "./modules/payments/payments.routes";
import { cors } from "hono/cors";
import { gatewayAuthMiddleware } from "./middleware/auth.middleware";

// Creamos la app principal
const app = new Hono<{ Bindings: Env }>();

// Middlewares globales
app.use("*", logger());
app.use("*", prettyJSON());

// Middleware de autenticación
// app.use("*", gatewayAuthMiddleware);

app.use("*", cors({
  origin: ["https://app.devlexia.cc"], // Permite requests desde localhost:3003
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-Gateway-Auth"],
  credentials: true,
}));


// Rutas
app.route("/payments", paymentRoutes);

// Healthcheck
app.get("/health", (c) => c.json({ ok: true }));

export default app;
