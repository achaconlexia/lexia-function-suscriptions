import { Client } from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema/files";
import { Env } from "@/config/bindings";

type DbOperation<T> = (db: NodePgDatabase<typeof schema>) => Promise<T>;

export const executeDbOperation = async <T>(
  env: Env,
  operation: DbOperation<T>
): Promise<T> => {
  if (!env.HYPERDRIVE?.connectionString) {
    throw new Error("Hyperdrive binding no está configurado en el entorno");
  }

  const client = new Client({
    connectionString: env.HYPERDRIVE.connectionString,
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
