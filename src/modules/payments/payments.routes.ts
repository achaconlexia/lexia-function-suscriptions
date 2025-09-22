// src/modules/payments/payment.routes.ts
import { Hono } from "hono";
import { PaymentController } from "./payments.controller";

export const paymentRoutes = new Hono()
  // Crear un nuevo pago
  .post("/", PaymentController.create)
  .get("/", PaymentController.findAll)
  .get("/:id", PaymentController.findById)
  .put("/:id", PaymentController.update)
  .delete("/:id", PaymentController.remove)
  .post("/:id/receipt", PaymentController.uploadReceipt)
  .get("/:id/receipt", PaymentController.getReceiptUrl);
