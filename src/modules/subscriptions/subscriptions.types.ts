// src/modules/subscriptions/subscriptions.types.ts
import { Env } from "@/config/bindings";

/** Datos para crear una suscripción */
// src/modules/subscriptions/subscriptions.types.ts

/** Datos para crear una suscripción */
export interface CreateSubscriptionParams {
	// Campos que se generan internamente (OpenMeter)
	subscriptionId?: string; // ← Hacer opcional
	customerId?: string; // ← Hacer opcional

	subjectKey: string;
	userId: string;
	workspaceId: string;
	organizationName?: string;
	planKey: string;
	status?: string; // "active", "cancelled", "expired"
	startDate: Date;
	endDate?: Date;
	currency?: string;
	paymentId?: string;
	metadata?: Record<string, any>;
}

/** Datos para actualizar una suscripción */
export interface UpdateSubscriptionParams {
	status?: string;
	endDate?: Date;
	metadata?: Record<string, any>;
}

/** Filtros para listar suscripciones con paginación */
export interface SubscriptionFilters {
	status?: string;
	userId?: string;
	workspaceId?: string;
	planKey?: string;
	page: number;
	limit: number;
	offset: number;
}

/** Filtros opcionales más flexibles para listar suscripciones */
export interface ListSubscriptionsFilters {
	status?: string;
	userId?: string;
	workspaceId?: string;
	planKey?: string;
	limit?: number;
	offset?: number;
}
