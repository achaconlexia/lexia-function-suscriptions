// src/modules/files/file.service.ts
import { FileRepo } from "./file.repo";
import { Env } from "@/config/bindings";
import { S3Service } from "@/services/s3.service";

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

interface UploadFileParams {
  file: File;
  workspaceId: string;
  userId: string;
  folderId?: string;
}

export const FileService = {
  createFile: async (env: Env, data: CreateFileParams) => {
    return FileRepo.create(env, data);
  },

  updateFile: async (env: Env, id: string, data: UpdateFileParams) => {
    return FileRepo.update(env, id, data);
  },

  deleteFile: async (env: Env, id: string) => {
    return FileRepo.remove(env, id);
  },

  getFileById: async (env: Env, id: string) => {
    return FileRepo.findById(env, id);
  },

  getFilesWithPagination: async (
    env: Env,
    workspaceId: string,
    filters: FileFilters
  ) => {
    return FileRepo.findWithPagination(env, workspaceId, filters);
  },

  uploadFile: async (env: Env, params: UploadFileParams) => {
    const { file, workspaceId, userId, folderId } = params;
    
    // Inicializar el servicio S3
    const s3Service = new S3Service(env);
    
    // Extraer metadatos del archivo
    const metadata = s3Service.extractFileMetadata(file);
    
    // Generar la clave para S3
    const s3Key = s3Service.generateFileKey(workspaceId, userId, file.name, folderId);
    
    // Subir el archivo a S3
    const storagePath = await s3Service.uploadFile(file, s3Key, {
      workspaceId,
      userId,
      folderId: folderId || '',
    });
    
    // Crear el registro en la base de datos
    const fileRecord = await FileRepo.create(env, {
      name: metadata.name,
      folderId: folderId || undefined,
      workspaceId,
      userId,
      fileType: metadata.fileType,
      extension: metadata.extension,
      size: metadata.size,
      mimeType: metadata.mimeType,
      storagePath,
    });
    
    // Verificar que se creó el registro
    if (!fileRecord || fileRecord.length === 0) {
      throw new Error("Failed to create file record in database");
    }
    
    return fileRecord;
  },
};
