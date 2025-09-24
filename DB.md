# ✅ Solución: Migrar tu esquema con Drizzle

## Asegúrate de que tu drizzle.config.ts apunta a la base correcta

import { defineConfig } from "drizzle-kit";

export default defineConfig({
dialect: "postgresql",
schema: "./src/db/schema/index.ts",
out: "./drizzle",
dbCredentials: {
host: "localhost",
port: 5432,
user: "lexia_user",
password: "lexia_password",
database: "lexia-saas",
ssl: false,
},
migrations: {
table: "\_\_drizzle_migrations_files",
schema: "drizzle",
},
});

## 2. Ejecuta la migración

npm run db:migrate
npx drizzle-kit migrate

## ✅ Verificar que se creó la tabla

- psql -d lexia-saas
- \dt

## ✅ Probar de nuevo

- npm run worker:dev:local
