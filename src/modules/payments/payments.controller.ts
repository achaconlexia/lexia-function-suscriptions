// src/modules/payments/payments.controller.ts
import { Context } from "hono";
import { Env } from "@/config/bindings";
import { PaymentService } from "./payments.service";

export const PaymentController = {
  // Crear un nuevo pago
  create: async (c: Context) => {
    try {
      const body = await c.req.json<{
        workspaceId: string;
        invoiceId?: string;
        gatewayId: string;
        amount: string; 
        currency: string;
        method: string;
        status?: string;
        organizationName?: string;
        type?: string;
        attemptDate?: Date;
      }>();


      console.log("📩 Payment body recibido:", body);

      if (!body.workspaceId || !body.gatewayId || !body.amount || !body.currency || !body.method) {
        return c.json({ error: "Missing required fields" }, 400);
      }

      const payment = await PaymentService.createPayment(c.env, body);
      console.log('Pago creado:', payment);
      return c.json({ success: true, data: payment });
    } catch (error) {
      console.error("❌ Payment create error:", error instanceof Error ? error.message : error);
      return c.json({ success: false, error: "Failed to create payment" }, 500);
    }
  },

  // Listar pagos con filtros
  findAll: async (c: Context) => {
    try {
      const workspaceId = c.req.query("workspaceId");
      const status = c.req.query("status");
      const method = c.req.query("method");
      const page = parseInt(c.req.query("page") || "1");
      const limit = parseInt(c.req.query("limit") || "20");
      const offset = (page - 1) * limit;

      if (!workspaceId) {
        return c.json({ error: "workspaceId is required" }, 400);
      }

      const payments = await PaymentService.listPayments(c.env, workspaceId, {
        status,
        method,
        limit,
        offset,
      });

      return c.json({ success: true, data: payments });
    } catch (error) {
      console.error("❌ Payment list error:", error instanceof Error ? error.message : error);
      return c.json({ success: false, error: "Failed to list payments" }, 500);
    }
  },

  // Obtener pago por ID
  findById: async (c: Context) => {
    try {
      const id = c.req.param("id");
      const payment = await PaymentService.getPaymentById(c.env, id);

      if (!payment) {
        return c.json({ error: "Payment not found" }, 404);
      }

      return c.json({ success: true, data: payment });
    } catch (error) {
      console.error("❌ Payment findById error:", error instanceof Error ? error.message : error);
      return c.json({ success: false, error: "Failed to get payment" }, 500);
    }
  },

  // Actualizar un pago
  update: async (c: Context) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json<{
        status?: string;
        amount?: string;
        method?: string;
        confirmedDate?: Date;
        organizationName?: string;
      }>();

      if (Object.keys(body).length === 0) {
        return c.json({ error: "No fields provided to update" }, 400);
      }

      const updatedPayment = await PaymentService.updatePayment(c.env, id, body);
      return c.json({ success: true, data: updatedPayment });
    } catch (error) {
      console.error("❌ Payment update error:", error instanceof Error ? error.message : error);
      return c.json({ success: false, error: "Failed to update payment" }, 500);
    }
  },

  // Eliminar un pago
  remove: async (c: Context) => {
    try {
      const id = c.req.param("id");
      await PaymentService.deletePayment(c.env, id);
      return c.json({ success: true });
    } catch (error) {
      console.error("❌ Payment delete error:", error instanceof Error ? error.message : error);
      return c.json({ success: false, error: "Failed to delete payment" }, 500);
    }
  },

  // Subir comprobante / recibo a S3
  uploadReceipt: async (c: Context) => {
    try {
      const formData = await c.req.formData();
      const file = formData.get("file") as File;
      const workspaceId = formData.get("workspaceId") as string;
      const userId = formData.get("userId") as string;
      const paymentId = c.req.param("id");

      if (!file || !workspaceId || !userId) {
        return c.json({ error: "Missing required parameters or file" }, 400);
      }

      const result = await PaymentService.uploadReceipt({
        env: c.env,
        file,
        workspaceId,
        userId,
        paymentId,
      });

      return c.json({ success: true, data: result });
    } catch (error) {
      console.error("❌ Upload receipt error:", error instanceof Error ? error.message : error);
      return c.json({ success: false, error: "Failed to upload receipt" }, 500);
    }
  },

  // Obtener URL del comprobante
  getReceiptUrl: async (c: Context) => {
    try {
      const id = c.req.param("id");
      const url = await PaymentService.getReceiptUrl(c.env, id);

      if (!url) {
        return c.json({ error: "Receipt not found" }, 404);
      }

      return c.json({ success: true, data: { url } });
    } catch (error) {
      console.error("❌ Get receipt URL error:", error instanceof Error ? error.message : error);
      return c.json({ success: false, error: "Failed to get receipt URL" }, 500);
    }
  },
};
