// src/modules/payments/payments.types.ts
import { Env } from "@/config/bindings";

/** Datos para crear un payment */
export interface CreatePaymentParams {
    workspaceId: string;
    invoiceId?: string;
    gatewayId: string;
    amount: string;
    currency: string;
    method: string;
    type?: string;       // Opcional, default 'manual'
    status?: string;     // Opcional, default 'Pendiente'
    attemptDate?: Date;  // Opcional, default ahora
    confirmedDate?: Date;
    storagePath?: string;
    organizationName?: string;
}

/** Datos para actualizar un payment */
export interface UpdatePaymentParams {
    status?: string;
    amount?: string;
    method?: string;
    confirmedDate?: Date;
    storagePath?: string;
    organizationName?: string;
}

/** Filtros para listar payments con paginación */
export interface PaymentFilters {
    status?: string;
    method?: string;
    page: number;
    limit: number;
    offset: number;
}

/** Filtros opcionales más flexibles para listar payments (si se desea) */
export interface ListPaymentsFilters {
    status?: string;
    method?: string;
    limit?: number;
    offset?: number;
}

/** Parámetros para subir un comprobante asociado a un payment */
export interface UploadReceiptParams {
    env: Env;
    file: File;
    workspaceId: string;
    userId: string;
    paymentId: string;
}
