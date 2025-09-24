// src/modules/subscriptions/payment.routes.ts
import { Hono } from "hono";
import { SubscriptionController } from "./subscriptions.controller";

// src/modules/subscriptions/subscriptions.routes.ts

export const subscriptionRoutes = new Hono()
	// Crear una nueva suscripción
	.post("/", SubscriptionController.create)
	.get("/", SubscriptionController.findAll) // Ya tenías este (por workspace)
	.get("/all", SubscriptionController.findAllSubscriptions) // Nuevo endpoint
	.get("/:id", SubscriptionController.findById)
	.get("/me", SubscriptionController.isSubscribed)
	.put("/:id", SubscriptionController.update)
	.delete("/:id", SubscriptionController.remove);
