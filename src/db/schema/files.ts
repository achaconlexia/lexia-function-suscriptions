// src/db/schema/files.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const files = pgTable(
  "files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    folderId: text("folder_id"),
    workspaceId: text("workspace_id").notNull(),
    userId: text("user_id").notNull(),

    fileType: text("file_type").notNull(), // 'document', 'image', 'spreadsheet', etc.
    extension: text("extension"), // 'pdf', 'docx', 'xlsx', etc.
    size: integer("size"), // tamaño en bytes
    mimeType: text("mime_type"),
    storagePath: text("storage_path"), // ruta en storage/cloud

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    folderIdIdx: index("idx_files_folder_id").on(table.folderId),
    workspaceIdIdx: index("idx_files_workspace_id").on(table.workspaceId),
    userIdIdx: index("idx_files_user_id").on(table.userId),
  })
);
