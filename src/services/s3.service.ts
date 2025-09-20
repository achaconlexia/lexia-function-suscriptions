// src/services/s3.service.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Env } from "@/config/bindings";

export class S3Service {
  private client: S3Client;
  private bucketName: string;

  constructor(env: Env) {
    // Para desarrollo local, usar process.env; para producción, usar env
    const accessKeyId = env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
    const region = env.AWS_REGION || process.env.AWS_REGION || "us-east-1";
    const bucketName = env.S3_BUCKET_NAME || process.env.S3_BUCKET_NAME;

    if (!accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error("AWS credentials are not configured properly");
    }

    this.client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucketName = bucketName;
  }

  async uploadFile(
    file: File,
    key: string,
    metadata?: Record<string, string>
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: new Uint8Array(await file.arrayBuffer()),
        ContentType: file.type,
        ContentLength: file.size,
        Metadata: metadata,
      });

      await this.client.send(command);

      // Retornar la URL del archivo
      return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw new Error("Failed to upload file to S3");
    }
  }

  generateFileKey(
    workspaceId: string,
    userId: string,
    fileName: string,
    folderId?: string
  ): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    
    // Construir la ruta: workspace/user/folder?/timestamp-randomId-filename
    let path = `${workspaceId}/${userId}`;
    
    if (folderId) {
      path += `/${folderId}`;
    }
    
    path += `/${timestamp}-${randomId}-${fileName}`;
    
    return path;
  }

  extractFileMetadata(file: File) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    // Determinar el tipo de archivo basado en el MIME type
    let fileType = 'other';
    if (file.type.startsWith('image/')) {
      fileType = 'image';
    } else if (file.type.startsWith('video/')) {
      fileType = 'video';
    } else if (file.type.startsWith('audio/')) {
      fileType = 'audio';
    } else if (file.type.includes('pdf')) {
      fileType = 'document';
    } else if (file.type.includes('word') || file.type.includes('document')) {
      fileType = 'document';
    } else if (file.type.includes('sheet') || file.type.includes('excel')) {
      fileType = 'spreadsheet';
    } else if (file.type.includes('presentation') || file.type.includes('powerpoint')) {
      fileType = 'presentation';
    }

    return {
      name: file.name,
      size: file.size,
      mimeType: file.type,
      extension,
      fileType,
    };
  }
}