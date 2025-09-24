// src/db/schema/subscriptions.ts
import {
	pgTable,
	uuid,
	text,
	timestamp,
	numeric,
	jsonb,
	index,
} from "drizzle-orm/pg-core";

export const subscriptions = pgTable(
	"subscriptions",
	{
		id: uuid("id").primaryKey().defaultRandom(),

		// Campos de OpenMeter (opcional hacerlos obligatorios o no)
		subscriptionId: text("subscription_id"), // Puede ser NULL
		customerId: text("customer_id"), // Puede ser NULL
		subjectKey: text("subject_key"), // Puede ser NULL

		// Campos de negocio
		userId: text("user_id"), // Puede ser NULL
		workspaceId: text("workspace_id"), // Puede ser NULL
		organizationName: text("organization_name"), // Puede ser NULL

		planKey: text("plan_key"), // Puede ser NULL
		status: text("status").default("active"), // Puede ser NULL (con default "active")

		startDate: timestamp("start_date"), // Puede ser NULL
		endDate: timestamp("end_date"), // Puede ser NULL

		currency: text("currency").default("USD"), // Puede ser NULL (con default "USD")

		// Relación con payments
		paymentId: text("payment_id"), // Puede ser NULL

		// Metadata adicional
		metadata: jsonb("metadata"),

		// Fechas de auditoría (normalmente no deben ser NULL)
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => ({
		// Índices
		userIdIdx: index("idx_subscriptions_user_id").on(table.userId),
		workspaceIdIdx: index("idx_subscriptions_workspace_id").on(
			table.workspaceId
		),
		subscriptionIdIdx: index("idx_subscriptions_subscription_id").on(
			table.subscriptionId
		),
		statusIdx: index("idx_subscriptions_status").on(table.status),
		paymentIdIdx: index("idx_subscriptions_payment_id").on(table.paymentId),
	})
);
