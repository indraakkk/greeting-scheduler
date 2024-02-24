import { Config } from 'drizzle-kit';

const DB_URL = process.env.DATABASE_URL;

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: { connectionString: DB_URL ?? '' },
} satisfies Config;
