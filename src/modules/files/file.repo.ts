// src/modules/files/file.repo.ts
import { executeDbOperation } from "@/db/client";
import { files } from "@/db/schema/files";
import { eq, and, isNull, sql } from "drizzle-orm";
import { Env } from "@/config/bindings";

interface CreateFileParams {
  name: string;
  folderId?: string;
  workspaceId: string;
  userId: string;
  fileType: string;
  extension?: string;
  size?: number;
  mimeType?: string;
  storagePath?: string;
}

interface UpdateFileParams {
  name?: string;
  folderId?: string | null;
  fileType?: string;
  extension?: string;
  size?: number;
  mimeType?: string;
  storagePath?: string;
}

interface FileFilters {
  folderId?: string;
  userId?: string;
  fileType?: string;
  page: number;
  limit: number;
  offset: number;
}

export const FileRepo = {
  create: (env: Env, data: CreateFileParams) =>
    executeDbOperation(env, (db) => db.insert(files).values(data).returning()),

  update: (env: Env, id: string, data: UpdateFileParams) =>
    executeDbOperation(env, (db) =>
      db.update(files).set(data).where(eq(files.id, id)).returning()
    ),

  remove: (env: Env, id: string) =>
    executeDbOperation(env, (db) =>
      db.delete(files).where(eq(files.id, id)).returning()
    ),

  findById: (env: Env, id: string) =>
    executeDbOperation(env, (db) =>
      db.query.files.findFirst({ where: eq(files.id, id) })
    ),

  findWithPagination: (env: Env, workspaceId: string, filters: FileFilters) => {
    const { folderId, userId, fileType, limit, offset } = filters;

    return executeDbOperation(env, async (db) => {
      // Construir condiciones WHERE
      const whereConditions = [eq(files.workspaceId, workspaceId)];

      if (folderId !== undefined) {
        if (folderId === null || folderId === "null") {
          // Buscar files en root (sin folderId)
          whereConditions.push(isNull(files.folderId));
        } else {
          // Buscar files en un folder específico
          whereConditions.push(eq(files.folderId, folderId));
        }
      } else {
        // Por defecto, mostrar files en root
        whereConditions.push(isNull(files.folderId));
      }

      // Agregar filtro por userId si se proporciona
      if (userId) {
        whereConditions.push(eq(files.userId, userId));
      }

      // Agregar filtro por fileType si se proporciona
      if (fileType) {
        whereConditions.push(eq(files.fileType, fileType));
      }

      const [filesResult, countResult] = await Promise.all([
        // Obtener files con paginación
        db.query.files.findMany({
          where: and(...whereConditions),
          limit,
          offset,
          orderBy: (files, { desc }) => [desc(files.createdAt)],
        }),

        // Contar total para paginación
        db
          .select({ count: sql<number>`count(*)` })
          .from(files)
          .where(and(...whereConditions))
          .then((result) => result[0]?.count || 0),
      ]);

      return {
        data: filesResult,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: countResult,
          totalPages: Math.ceil(countResult / filters.limit),
        },
      };
    });
  },
};
