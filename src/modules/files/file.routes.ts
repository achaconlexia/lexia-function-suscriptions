// src/modules/files/file.routes.ts
import { Hono } from "hono";
import { FileController } from "./file.controller";

export const fileRoutes = new Hono()
  .get("/test", FileController.test)
  .post("/upload", FileController.upload)
  .post("/", FileController.create)
  .get("/", FileController.findAll)
  .get("/:id", FileController.findById)
  .put("/:id", FileController.update)
  .delete("/:id", FileController.remove);
