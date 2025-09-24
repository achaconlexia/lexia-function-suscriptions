// CREATE DATABASE "lexia-saas";
// CREATE USER lexia_user WITH PASSWORD 'lexia_password';
// GRANT ALL PRIVILEGES ON DATABASE "lexia-saas" TO lexia_user;
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/db/schema/index.ts", // ruta donde defines tus tablas
	out: "./drizzle", // carpeta donde se generan migraciones
	dbCredentials: {
		// local postgres (mac)
		host: "localhost",
		port: 5432,
		user: "lexia_user",
		password: "lexia_password",
		database: "lexia-saas",
		ssl: false,

		// url: "postgres://postgres:JglaqZz7LOf78OlC5ryS@lexia-aurora-psql-develop.cluster-c6dmuuo8gatt.us-east-1.rds.amazonaws.com:5432/files_db?sslmode=no-verify",
	},
	migrations: {
		table: "__drizzle_migrations_files", // nombre de la tabla de control
		schema: "drizzle", // schema donde se crea esa tabla
	},
});
