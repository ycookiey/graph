import { createClient } from '@libsql/client/web';
import type { Client } from '@libsql/client/web';

export type EntryRow = {
  date: string;
  value: number;
};

export type TursoEnv = {
  TURSO_DATABASE_URL?: string;
  TURSO_AUTH_TOKEN?: string;
};

function getRequiredEnvVar(env: TursoEnv | undefined, name: keyof TursoEnv): string {
  const direct = env?.[name];
  if (typeof direct === 'string' && direct.length > 0) return direct;

  const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
  if (typeof fromProcess === 'string' && fromProcess.length > 0) return fromProcess;

  const fromImportMeta = (import.meta as any).env?.[name];
  if (typeof fromImportMeta === 'string' && fromImportMeta.length > 0) return fromImportMeta;

  throw new Error(`Missing environment variable: ${String(name)}`);
}

function getOptionalEnvVar(env: TursoEnv | undefined, name: keyof TursoEnv): string | undefined {
  const direct = env?.[name];
  if (typeof direct === 'string' && direct.length > 0) return direct;

  const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
  if (typeof fromProcess === 'string' && fromProcess.length > 0) return fromProcess;

  const fromImportMeta = (import.meta as any).env?.[name];
  if (typeof fromImportMeta === 'string' && fromImportMeta.length > 0) return fromImportMeta;

  return undefined;
}

let client: Client | null = null;
let clientKey: string | null = null;

export function getDbClient(env?: TursoEnv): Client {
  const url = getRequiredEnvVar(env, 'TURSO_DATABASE_URL');
  const authToken = getOptionalEnvVar(env, 'TURSO_AUTH_TOKEN');
  const nextKey = `${url}|${authToken ?? ''}`;

  if (client && clientKey === nextKey) return client;

  client = createClient({
    url,
    ...(authToken ? { authToken } : {}),
  });
  clientKey = nextKey;

  return client;
}

export async function listEntriesSince(
  env: TursoEnv | undefined,
  userId: string,
  startDate: string,
): Promise<EntryRow[]> {
  const db = getDbClient(env);
  const result = await db.execute({
    sql: 'SELECT date, value FROM entries WHERE clerk_user_id = ? AND date >= ? ORDER BY date ASC',
    args: [userId, startDate],
  });

  return (result.rows as unknown as Array<{ date: string; value: number }>).map((row) => ({
    date: row.date,
    value: Number(row.value),
  }));
}

export async function getEntryValue(
  env: TursoEnv | undefined,
  userId: string,
  date: string,
): Promise<number | null> {
  const db = getDbClient(env);
  const result = await db.execute({
    sql: 'SELECT value FROM entries WHERE clerk_user_id = ? AND date = ? LIMIT 1',
    args: [userId, date],
  });

  if (result.rows.length === 0) return null;
  const row = result.rows[0] as unknown as { value: number };
  return Number(row.value);
}

export async function upsertEntry(
  env: TursoEnv | undefined,
  userId: string,
  date: string,
  value: number,
): Promise<void> {
  const db = getDbClient(env);
  await db.execute({
    sql: [
      'INSERT INTO entries (clerk_user_id, date, value)',
      'VALUES (?, ?, ?)',
      'ON CONFLICT(clerk_user_id, date) DO UPDATE SET value=excluded.value',
    ].join(' '),
    args: [userId, date, value],
  });
}
