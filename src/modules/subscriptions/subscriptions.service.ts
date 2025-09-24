// src/modules/subscriptions/payments.service.ts
import { SubscriptionRepo } from "./subscriptions.repo";
import { Env } from "@/config/bindings";
import {
	CreateSubscriptionParams,
	UpdateSubscriptionParams,
	ListSubscriptionsFilters,
	SubscriptionFilters,
} from "./subscriptions.types";

export const SubscriptionService = {
	createSubscription: async (env: Env, data: CreateSubscriptionParams) => {
		return SubscriptionRepo.create(env, data);
	},

	updateSubscription: async (
		env: Env,
		id: string,
		data: UpdateSubscriptionParams
	) => {
		return SubscriptionRepo.update(env, id, data);
	},

	deleteSubscription: async (env: Env, id: string) => {
		return SubscriptionRepo.remove(env, id);
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

		// Aquí puedes llamar a una nueva función en el repo que no filtre por workspace
		return SubscriptionRepo.findAll(env, repoFilters);
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
