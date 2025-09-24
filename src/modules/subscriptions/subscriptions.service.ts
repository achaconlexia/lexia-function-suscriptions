// src/modules/subscriptions/payments.service.ts
import { SubscriptionRepo } from "./subscriptions.repo";
import { Env } from "@/config/bindings";
import {
	CreateSubscriptionParams,
	UpdateSubscriptionParams,
	ListSubscriptionsFilters,
	SubscriptionFilters,
} from "./subscriptions.types";

// Funciones para llamar a OpenMeter
const createOpenMeterSubject = async (
	env: Env,
	subjectKey: string,
	displayName: string,
	userId: string,
	workspaceId: string
): Promise<any> => {
	const response = await fetch("https://openmeter.cloud/api/v1/subjects", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${env.OPENMETER_TOKEN}`,
		},
		body: JSON.stringify([
			{
				key: subjectKey,
				displayName,
				metadata: {
					userId,
					workspaceId,
				},
			},
		]),
	});

	if (!response.ok) {
		throw new Error(`OpenMeter subject error: ${response.statusText}`);
	}

	return response.json();
};

const getOpenMeterCustomer = async (
	env: Env,
	subjectKey: string
): Promise<any> => {
	const response = await fetch(
		`https://openmeter.cloud/api/v1/customers/${subjectKey}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${env.OPENMETER_TOKEN}`,
			},
		}
	);

	if (!response.ok) {
		throw new Error(`OpenMeter customer error: ${response.statusText}`);
	}

	return response.json();
};

const createOpenMeterSubscription = async (
	env: Env,
	customerId: string,
	planKey: string,
	paymentId: string,
	amount: string
): Promise<any> => {
	const response = await fetch("https://openmeter.cloud/api/v1/subscriptions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${env.OPENMETER_TOKEN}`,
		},
		body: JSON.stringify({
			customerId,
			plan: {
				key: planKey,
				version: 1,
			},
			metadata: {
				IdPago: paymentId,
				Monto: amount,
			},
		}),
	});

	if (!response.ok) {
		throw new Error(`OpenMeter subscription error: ${response.statusText}`);
	}

	return response.json();
};

const deleteOpenMeterSubscription = async (
	env: Env,
	subscriptionId: string
): Promise<void> => {
	const response = await fetch(
		`https://openmeter.cloud/api/v1/subscriptions/${subscriptionId}`,
		{
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${env.OPENMETER_TOKEN}`,
			},
		}
	);

	if (!response.ok) {
		throw new Error(`OpenMeter delete error: ${response.statusText}`);
	}
};

export const SubscriptionService = {
	// Crear suscripción completa (OpenMeter + DB)
	createSubscription: async (env: Env, data: CreateSubscriptionParams) => {
		// 1. Crear subject en OpenMeter
		const subjectResponse = await createOpenMeterSubject(
			env,
			data.subjectKey,
			data.organizationName || data.userId,
			data.userId,
			data.workspaceId
		);
		const subjectId = subjectResponse[0].id;

		// 2. Crear customer en OpenMeter
		const customerData = await getOpenMeterCustomer(env, data.subjectKey);
		const customerId = customerData.id;

		// 3. Crear subscription en OpenMeter
		const openMeterSubscription = await createOpenMeterSubscription(
			env,
			customerId,
			data.planKey,
			data.paymentId || "no-payment",
			"0" // Puedes pasar el monto real si lo tienes
		);

		// 4. Guardar en tu DB local
		const subscription = await SubscriptionRepo.create(env, {
			...data,
			subscriptionId: openMeterSubscription.id,
			customerId,
			subjectKey: data.subjectKey,
			status: openMeterSubscription.status,
			startDate: new Date(openMeterSubscription.activeFrom),
			currency: openMeterSubscription.currency,
		});

		return subscription;
	},

	// Cancelar suscripción (OpenMeter + DB)
	deleteSubscription: async (env: Env, id: string) => {
		// 1. Cancelar en OpenMeter
		await deleteOpenMeterSubscription(env, id);

		// 2. Actualizar estado en DB
		return SubscriptionRepo.update(env, id, { status: "cancelled" });
	},

	// Resto de métodos (sin cambios)
	updateSubscription: async (
		env: Env,
		id: string,
		data: UpdateSubscriptionParams
	) => {
		return SubscriptionRepo.update(env, id, data);
	},

	getSubscriptionById: async (env: Env, id: string) => {
		return SubscriptionRepo.findById(env, id);
	},

	getSubscriptionsByUserId: async (env: Env, userId: string) => {
		return SubscriptionRepo.findByUserId(env, userId);
	},

	getSubscriptionsByWorkspaceId: async (env: Env, workspaceId: string) => {
		return SubscriptionRepo.findByWorkspaceId(env, workspaceId);
	},

	listSubscriptions: async (
		env: Env,
		workspaceId: string,
		filters: ListSubscriptionsFilters
	) => {
		const page = 1;
		const limit = filters.limit || 20;
		const offset = filters.offset ?? (page - 1) * limit;

		const repoFilters: SubscriptionFilters = {
			...filters,
			page,
			limit,
			offset,
		};

		return SubscriptionRepo.findWithPagination(env, workspaceId, repoFilters);
	},

	// src/modules/subscriptions/subscriptions.service.ts

	// Añadir esta función al objeto SubscriptionService
	listAllSubscriptions: async (env: Env, filters: ListSubscriptionsFilters) => {
		const page = 1;
		const limit = filters.limit || 20;
		const offset = filters.offset ?? (page - 1) * limit;

		const repoFilters: SubscriptionFilters = {
			...filters,
			page,
			limit,
			offset,
		};

		// Aquí puedes llamar a una nueva función en el repo que no filtre por workspace
		return SubscriptionRepo.findAll(env, repoFilters);
	},
};
