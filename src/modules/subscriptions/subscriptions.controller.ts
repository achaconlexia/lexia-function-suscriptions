// src/modules/subscriptions/payments.controller.ts
import { Context } from "hono";
import { Env } from "@/config/bindings";
import { SubscriptionService } from "./subscriptions.service";

export const SubscriptionController = {
	// Crear una nueva suscripción
	// src/modules/subscriptions/subscriptions.controller.ts

	// Crear una nueva suscripción
	create: async (c: Context) => {
		try {
			const body = await c.req.json<{
				subjectKey: string;
				// userId?: string;          // ← Quitar de body
				// workspaceId?: string;     // ← Quitar de body
				organizationName?: string;
				planKey: string;
				// startDate?: string;       // ← Quitar de body
				endDate?: string;
				currency?: string;
				paymentId?: string;
				metadata?: Record<string, any>;
			}>();

			console.log("📩 Subscription body recibido:", body);

			if (
				// !body.subscriptionId ||  // ← Quitar de validación
				// !body.customerId ||      // ← Quitar de validación
				!body.subjectKey ||
				// !body.userId ||          // ← Quitar de validación
				// !body.workspaceId ||     // ← Quitar de validación
				!body.planKey
				// !body.startDate          // ← Quitar de validación
			) {
				return c.json({ error: "Missing required fields" }, 400);
			}

			// Generar valores internos
			const userId = body.subjectKey; // ← Usar subjectKey como userId
			const workspaceId = body.organizationName || body.subjectKey; // ← Igualar a organizationName o usar subjectKey
			const startDate = new Date(); // ← Usar fecha actual

			const subscription = await SubscriptionService.createSubscription(c.env, {
				...body,
				userId, // ← Generado internamente
				workspaceId, // ← Generado internamente
				startDate, // ← Generado internamente
				endDate: body.endDate ? new Date(body.endDate) : undefined,
			});

			console.log("Suscripción creada:", subscription);
			return c.json({ success: true, data: subscription });
		} catch (error) {
			console.error(
				"❌ Subscription create error:",
				error instanceof Error ? error.message : error
			);
			return c.json(
				{ success: false, error: "Failed to create subscription" },
				500
			);
		}
	},

	// Listar suscripciones con filtros
	findAll: async (c: Context) => {
		try {
			const workspaceId = c.req.query("workspaceId");
			const status = c.req.query("status");
			const userId = c.req.query("userId");
			const planKey = c.req.query("planKey");
			const page = parseInt(c.req.query("page") || "1");
			const limit = parseInt(c.req.query("limit") || "20");
			const offset = (page - 1) * limit;

			if (!workspaceId) {
				return c.json({ error: "workspaceId is required" }, 400);
			}

			const subscriptions = await SubscriptionService.listSubscriptions(
				c.env,
				workspaceId,
				{
					status,
					userId,
					planKey,
					limit,
					offset,
				}
			);

			return c.json({ success: true, data: subscriptions });
		} catch (error) {
			console.error(
				"❌ Subscription list error:",
				error instanceof Error ? error.message : error
			);
			return c.json(
				{ success: false, error: "Failed to list subscriptions" },
				500
			);
		}
	},

	// Obtener suscripción por ID
	findById: async (c: Context) => {
		try {
			const id = c.req.param("id");
			const subscription = await SubscriptionService.getSubscriptionById(
				c.env,
				id
			);

			if (!subscription) {
				return c.json({ error: "Subscription not found" }, 404);
			}

			return c.json({ success: true, data: subscription });
		} catch (error) {
			console.error(
				"❌ Subscription findById error:",
				error instanceof Error ? error.message : error
			);
			return c.json(
				{ success: false, error: "Failed to get subscription" },
				500
			);
		}
	},

	// Actualizar una suscripción
	update: async (c: Context) => {
		try {
			const id = c.req.param("id");
			const body = await c.req.json<{
				status?: string;
				endDate?: string;
				metadata?: Record<string, any>;
			}>();

			if (Object.keys(body).length === 0) {
				return c.json({ error: "No fields provided to update" }, 400);
			}

			const updatedSubscription = await SubscriptionService.updateSubscription(
				c.env,
				id,
				{
					...body,
					endDate: body.endDate ? new Date(body.endDate) : undefined,
				}
			);
			return c.json({ success: true, data: updatedSubscription });
		} catch (error) {
			console.error(
				"❌ Subscription update error:",
				error instanceof Error ? error.message : error
			);
			return c.json(
				{ success: false, error: "Failed to update subscription" },
				500
			);
		}
	},

	// Eliminar una suscripción
	remove: async (c: Context) => {
		try {
			const id = c.req.param("id");
			await SubscriptionService.deleteSubscription(c.env, id);
			return c.json({ success: true });
		} catch (error) {
			console.error(
				"❌ Subscription delete error:",
				error instanceof Error ? error.message : error
			);
			return c.json(
				{ success: false, error: "Failed to delete subscription" },
				500
			);
		}
	},

	// Listar *todas* las suscripciones (solo para admins o con permisos)
	// Listar *todas* las suscripciones (solo para admins o con permisos)
	findAllSubscriptions: async (c: Context) => {
		try {
			const status = c.req.query("status"); // Opcional: filtrar por status
			const page = parseInt(c.req.query("page") || "1");
			const limit = parseInt(c.req.query("limit") || "20");
			const offset = (page - 1) * limit;

			// Aquí puedes validar si el usuario es admin, por ejemplo:
			// if (c.env.USER_ROLE !== "admin") {
			//   return c.json({ error: "Forbidden" }, 403);
			// }

			const subscriptions = await SubscriptionService.listAllSubscriptions(
				c.env,
				{
					status,
					limit,
					offset,
				}
			);

			return c.json({ success: true, data: subscriptions });
		} catch (error) {
			console.error(
				"❌ List all subscriptions error:",
				error instanceof Error ? error.message : error
			);
			return c.json(
				{ success: false, error: "Failed to list all subscriptions" },
				500
			);
		}
	},
	// src/modules/subscriptions/subscriptions.controller.ts

	// Añade esta función al final del objeto SubscriptionController
	isSubscribed: async (c: Context) => {
		try {
			const userId = c.req.query("userId");

			if (!userId) {
				return c.json({ error: "userId is required" }, 400);
			}

			const subscriptions = await SubscriptionService.getSubscriptionsByUserId(
				c.env,
				userId
			);
			const activeSubscription = subscriptions.find(
				(sub) => sub.status === "active"
			);

			return c.json({
				success: true,
				data: {
					subscribed: !!activeSubscription,
					subscription: activeSubscription || null,
				},
			});
		} catch (error) {
			console.error(
				"❌ Subscription check error:",
				error instanceof Error ? error.message : error
			);
			return c.json(
				{ success: false, error: "Failed to check subscription status" },
				500
			);
		}
	},
};
