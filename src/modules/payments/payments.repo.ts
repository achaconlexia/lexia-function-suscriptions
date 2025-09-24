// src/modules/payments/payments.repo.ts
import { executeDbOperation } from "@/db/client";
import { payments } from "@/db/schema/payments";
import { eq, and, sql, desc } from "drizzle-orm";
import { Env } from "@/config/bindings";
import { CreatePaymentParams, UpdatePaymentParams, PaymentFilters } from "./payments.types";


export const PaymentRepo = {
  create: (env: Env, data: CreatePaymentParams) =>
    executeDbOperation(env, (db) =>
      db.insert(payments).values({
        ...data,
        amount: data.amount,
        status: data.status || "Pendiente",
        type: data.type || "manual",
        attemptDate: data.attemptDate ? new Date(data.attemptDate) : new Date(),
      }).returning()
    ),

  update: (env: Env, id: string, data: UpdatePaymentParams) =>
    executeDbOperation(env, (db) =>
      db.update(payments)
        .set({
          ...data,
          confirmedDate: data.confirmedDate ? new Date(data.confirmedDate) : undefined,
        })
        .where(eq(payments.id, id))
        .returning()
    ),

  remove: (env: Env, id: string) =>
    executeDbOperation(env, (db) =>
      db.delete(payments)
        .where(eq(payments.id, id))
        .returning()
    ),

  findById: (env: Env, id: string) =>
    executeDbOperation(env, (db) =>
      db.query.payments.findFirst({ where: eq(payments.id, id) })
    ),

  findWithPagination: (env: Env, workspaceId: string, filters: PaymentFilters) => {
    const { status, method, limit, offset } = filters;

    return executeDbOperation(env, async (db) => {
      const whereConditions = [eq(payments.workspaceId, workspaceId)];

      if (status) whereConditions.push(eq(payments.status, status));
      if (method) whereConditions.push(eq(payments.method, method));

      const [paymentsResult, countResult] = await Promise.all([
        db.query.payments.findMany({
          where: and(...whereConditions),
          limit,
          offset,
          orderBy: (p) => [desc(p.createdAt)],
        }),
        db
          .select({ count: sql<number>`count(*)` })
          .from(payments)
          .where(and(...whereConditions))
          .then((res) => res[0]?.count || 0),
      ]);

      return {
        data: paymentsResult,
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
