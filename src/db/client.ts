//src/db/client.ts
import { Client } from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema/subscriptions";
import { Env } from "@/config/bindings";

type DbOperation<T> = (db: NodePgDatabase<typeof schema>) => Promise<T>;

export const executeDbOperation = async <T>(
	env: Env,
	operation: DbOperation<T>
): Promise<T> => {
	let connectionString: string | undefined = env.HYPERDRIVE?.connectionString;
	const localConnectionString =
		"postgresql://lexia_user:lexia_password@localhost:5432/lexia-saas?sslmode=disable";

	if (process.env.NODE_ENV === "development") {
		connectionString = localConnectionString;
	}

	if (!connectionString) {
		throw new Error("Hyperdrive binding no está configurado en el entorno");
	}

	const client = new Client({
		connectionString,
		ssl: { rejectUnauthorized: false },
	});

	try {
		await client.connect();
		const db = drizzle(client, { schema });
		return await operation(db);
	} finally {
		await client.end();
	}
};
