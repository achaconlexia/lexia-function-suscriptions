// src/db/schema/payments.ts
import { pgTable, uuid, text, timestamp, numeric, index, json } from "drizzle-orm/pg-core";

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    organizationName: text("organization_name"),
    workspaceId: text("workspace_id").notNull(), // Organization
    invoiceId: text("invoice_id"), // Factura asociada
    gatewayId: text("gateway_id"), // ID del gateway de pago

    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull(), // 'USD', 'EUR', 'PEN', etc.

    status: text("status").notNull(), // 'Pendiente', 'Exitoso', 'Cancelado', 'Fallido'
    method: text("method").notNull(), // 'PayPal', 'Tarjeta', 'Otro'
    type: text("type").notNull(), // 'manual' o 'pasarela'

    attemptDate: timestamp("attempt_date").notNull(),
    confirmedDate: timestamp("confirmed_date"), // nullable

    storagePath: text("storage_path"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("idx_payments_workspace_id").on(table.workspaceId),
    invoiceIdIdx: index("idx_payments_invoice_id").on(table.invoiceId),
    gatewayIdIdx: index("idx_payments_gateway_id").on(table.gatewayId),
    statusIdx: index("idx_payments_status").on(table.status),
  })
);



