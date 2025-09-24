// src/modules/subscriptions/subscriptions.repo.ts
import { executeDbOperation } from "@/db/client";
import { subscriptions } from "@/db/schema/subscriptions";
import { eq, and, sql, desc } from "drizzle-orm";
import { Env } from "@/config/bindings";
import {
	CreateSubscriptionParams,
	UpdateSubscriptionParams,
	SubscriptionFilters,
} from "./subscriptions.types";

export const SubscriptionRepo = {
	create: (env: Env, data: CreateSubscriptionParams) =>
		executeDbOperation(env, (db) =>
			db
				.insert(subscriptions)
				.values({
					...data,
					status: data.status || "active",
					currency: data.currency || "USD",
					startDate: new Date(data.startDate),
				})
				.returning()
		),

	update: (env: Env, id: string, data: UpdateSubscriptionParams) =>
		executeDbOperation(env, (db) =>
			db
				.update(subscriptions)
				.set({
					...data,
					updatedAt: new Date(),
				})
				.where(eq(subscriptions.id, id))
				.returning()
		),

	remove: (env: Env, id: string) =>
		executeDbOperation(env, (db) =>
			db.delete(subscriptions).where(eq(subscriptions.id, id)).returning()
		),

	findById: (env: Env, id: string) =>
		executeDbOperation(env, (db) =>
			db.query.subscriptions.findFirst({ where: eq(subscriptions.id, id) })
		),

	findByUserId: (env: Env, userId: string) =>
		executeDbOperation(env, (db) =>
			db.query.subscriptions.findMany({
				where: eq(subscriptions.userId, userId),
			})
		),

	findByWorkspaceId: (env: Env, workspaceId: string) =>
		executeDbOperation(env, (db) =>
			db.query.subscriptions.findMany({
				where: eq(subscriptions.workspaceId, workspaceId),
			})
		),

	findWithPagination: (
		env: Env,
		workspaceId: string,
		filters: SubscriptionFilters
	) => {
		const { status, userId, planKey, limit, offset } = filters;

		return executeDbOperation(env, async (db) => {
			const whereConditions = [eq(subscriptions.workspaceId, workspaceId)];

			if (status) whereConditions.push(eq(subscriptions.status, status));
			if (userId) whereConditions.push(eq(subscriptions.userId, userId));
			if (planKey) whereConditions.push(eq(subscriptions.planKey, planKey));

			const [subscriptionsResult, countResult] = await Promise.all([
				db.query.subscriptions.findMany({
					where: and(...whereConditions),
					limit,
					offset,
					orderBy: (s) => [desc(s.createdAt)],
				}),
				db
					.select({ count: sql<number>`count(*)` })
					.from(subscriptions)
					.where(and(...whereConditions))
					.then((res) => res[0]?.count || 0),
			]);

			return {
				data: subscriptionsResult,
				pagination: {
					page: Math.floor(offset / limit) + 1,
					limit,
					total: countResult,
					totalPages: Math.ceil(countResult / limit),
				},
			};
		});
	},

	// src/modules/subscriptions/subscriptions.repo.ts

	// Añadir esta función al objeto SubscriptionRepo
	findAll: (env: Env, filters: SubscriptionFilters) => {
		const { status, limit, offset } = filters;

		return executeDbOperation(env, async (db) => {
			const whereConditions = [];

			if (status) whereConditions.push(eq(subscriptions.status, status));

			const [subscriptionsResult, countResult] = await Promise.all([
				db.query.subscriptions.findMany({
					where: and(...whereConditions),
					limit,
					offset,
					orderBy: (s) => [desc(s.createdAt)],
				}),
				db
					.select({ count: sql<number>`count(*)` })
					.from(subscriptions)
					.where(and(...whereConditions))
					.then((res) => res[0]?.count || 0),
			]);

			return {
				data: subscriptionsResult,
				pagination: {
					page: Math.floor(offset / limit) + 1,
					limit,
					total: countResult,
					totalPages: Math.ceil(countResult / limit),
				},
			};
		});
	},
};
