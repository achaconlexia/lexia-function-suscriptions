// src/modules/files/file.controller.ts
import { Context } from "hono";
import { FileService } from "./file.service";

export const FileController = {
  upload: async (c: Context) => {
    try {
      // Obtener el form data
      const formData = await c.req.formData();

      // Obtener el archivo
      const file = formData.get("file") as File;
      if (!file) {
        console.log("❌ Upload failed: No file provided");
        return c.json({ error: "No file provided" }, 400);
      }

      // Obtener los parámetros requeridos
      const workspaceId = formData.get("workspaceId") as string;
      const userId = formData.get("userId") as string;
      const folderId = formData.get("folderId") as string;

      // Validar parámetros requeridos
      if (!workspaceId) {
        console.log("❌ Upload failed: Missing workspaceId");
        return c.json({ error: "workspaceId is required" }, 400);
      }
      if (!userId) {
        console.log("❌ Upload failed: Missing userId");
        return c.json({ error: "userId is required" }, 400);
      }

      console.log(`📤 Uploading file: ${file.name} (${file.size} bytes)`);

      // Limpiar folderId: convertir string vacío a undefined
      const cleanFolderId = folderId === "" ? undefined : folderId;

      // Subir el archivo
      const fileRecord = await FileService.uploadFile(c.env, {
        file,
        workspaceId,
        userId,
        folderId: cleanFolderId,
      });

      // Verificar que se creó el registro correctamente
      if (!fileRecord || fileRecord.length === 0 || !fileRecord[0]) {
        console.log("❌ Upload failed: File record not created");
        return c.json({
          success: false,
          error: "Failed to create file record"
        }, 500);
      }

      const createdFile = fileRecord[0];
      console.log(`✅ Upload successful: ${file.name} -> ${createdFile.id}`);

      // Retornar respuesta estandarizada para el frontend
      return c.json({
        success: true,
        message: 'File uploaded successfully',
        data: createdFile
      });
    } catch (error) {
      console.error("❌ Upload error:", error instanceof Error ? error.message : "Unknown error");
      return c.json({
        success: false,
        status: 'error',
        error: "Failed to upload file"
      }, 500);
    }
  },

  create: async (c: Context) => {
    const body = await c.req.json<{
      name: string;
      folderId?: string;
      workspaceId: string;
      userId: string;
      fileType: string;
      extension?: string;
      size?: number;
      mimeType?: string;
      storagePath?: string;
    }>();

    // Limpiar folderId: convertir string vacío a undefined
    const folderId = body.folderId === "" ? undefined : body.folderId;

    const file = await FileService.createFile(c.env, {
      name: body.name,
      folderId,
      workspaceId: body.workspaceId,
      userId: body.userId,
      fileType: body.fileType,
      extension: body.extension,
      size: body.size,
      mimeType: body.mimeType,
      storagePath: body.storagePath,
    });

    return c.json(file);
  },

  update: async (c: Context) => {
    const id = c.req.param("id");
    const body = await c.req.json<{
      name?: string;
      folderId?: string | null;
      folder_id?: string | null;
      fileType?: string;
      extension?: string;
      size?: number;
      mimeType?: string;
      storagePath?: string;
    }>();

    let folderId = body.folderId ?? body.folder_id;
    if (folderId === "" || folderId === "null") {
      folderId = null;
    }

    const updates: Record<string, any> = {};

    if (body.name !== undefined) updates.name = body.name;
    if (folderId !== undefined) updates.folderId = folderId; // null explícito 
    if (body.fileType !== undefined) updates.fileType = body.fileType;
    if (body.extension !== undefined) updates.extension = body.extension;
    if (body.size !== undefined) updates.size = body.size;
    if (body.mimeType !== undefined) updates.mimeType = body.mimeType;
    if (body.storagePath !== undefined) updates.storagePath = body.storagePath;

    if (Object.keys(updates).length === 0) {
      return c.json({ error: "No fields provided to update" }, 400);
    }

    updates.updatedAt = new Date();

    const file = await FileService.updateFile(c.env, id, updates);

    return c.json(file);
  },


  remove: async (c: Context) => {
    const id = c.req.param("id");
    await FileService.deleteFile(c.env, id);
    return c.json({ success: true });
  },

  findById: async (c: Context) => {
    const id = c.req.param("id");
    const file = await FileService.getFileById(c.env, id);
    return c.json(file);
  },

  findAll: async (c: Context) => {
    // Obtener query params
    const workspaceId = c.req.query("workspaceId");
    const folderId = c.req.query("folderId");
    const userId = c.req.query("userId");
    const fileType = c.req.query("fileType");
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "20");
    const offset = (page - 1) * limit;

    // Validar que workspaceId sea requerido
    if (!workspaceId) {
      return c.json({ error: "workspaceId is required" }, 400);
    }

    const result = await FileService.getFilesWithPagination(
      c.env,
      workspaceId,
      {
        folderId,
        userId,
        fileType,
        page,
        limit,
        offset,
      }
    );

    return c.json(result);
  },
};
