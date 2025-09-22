import { PaymentRepo } from "./payments.repo";
import { Env } from "@/config/bindings";
import { S3Service } from "@/services/s3.service";
import {
  CreatePaymentParams,
  UpdatePaymentParams,
  UploadReceiptParams,
  ListPaymentsFilters,
  PaymentFilters,
} from "./payments.types";

export const PaymentService = {
  createPayment: async (env: Env, data: CreatePaymentParams) => {
    return PaymentRepo.create(env, data);
  },

  updatePayment: async (env: Env, id: string, data: UpdatePaymentParams) => {
    return PaymentRepo.update(env, id, data);
  },

  deletePayment: async (env: Env, id: string) => {
    return PaymentRepo.remove(env, id);
  },

  getPaymentById: async (env: Env, id: string) => {
    return PaymentRepo.findById(env, id);
  },

  listPayments: async (env: Env, workspaceId: string, filters: ListPaymentsFilters) => {
    const page = 1;
    const limit = filters.limit || 20;
    const offset = filters.offset ?? (page - 1) * limit;

    const repoFilters: PaymentFilters = {
      ...filters,
      page,
      limit,
      offset,
    };

    return PaymentRepo.findWithPagination(env, workspaceId, repoFilters);
  },

  uploadReceipt: async (params: UploadReceiptParams) => {
    const { env, file, workspaceId, userId, paymentId } = params;

    if (!file) throw new Error("File is required");

    const s3Service = new S3Service(env);

    // Generar key único en S3
    const s3Key = s3Service.generateFileKey(workspaceId, userId, file.name, "receipts");

    // Subir el archivo
    const storagePath = await s3Service.uploadFile(file, s3Key, {
      workspaceId,
      userId,
      paymentId,
    });

    // Guardar la URL en la tabla payments
    const updatedPayment = await PaymentRepo.update(env, paymentId, { storagePath });

    return {
      storagePath,
      payment: updatedPayment,
    };
  },

  getReceiptUrl: async (env: Env, paymentId: string) => {
    const payment = await PaymentRepo.findById(env, paymentId);
    return payment?.storagePath || null;
  },
};
