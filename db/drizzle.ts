// import { drizzle } from 'drizzle-orm/postgres-js';
// // import { migrate } from 'drizzle-orm/postgres-js/migrator';
// import postgres from 'postgres';

// const DB_URL = process.env.DATABASE_URL as string

// // for migrations
// const migrationClient = postgres(DB_URL, { max: 1 });
// // migrate(drizzle(migrationClient), ...)

// // for query purposes
// const queryClient = postgres(DB_URL);
// const db = drizzle(queryClient);
// // await db.select().from(...)...

// export {migrationClient, db}



import * as schema from './schema'
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
export * from 'drizzle-orm'

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL')
}

let db: PostgresJsDatabase<typeof schema>

if (process.env.NODE_ENV === 'development') {
  db = singleton('db', () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('Missing DATABASE_URL')
    }
    const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 })
    migrate(drizzle(migrationClient), {
      migrationsFolder: './drizzle',
    })
    const queryClient = postgres(process.env.DATABASE_URL)
    return drizzle(queryClient, { schema })
  })
}
if (process.env.NODE_ENV === 'production') {
  const queryClient = postgres(process.env.DATABASE_URL)
  db = drizzle(queryClient, { schema })
}

export function singleton<Value>(name: string, value: () => Value): Value {
  const yolo = global as any
  yolo.__singletons ??= {}
  yolo.__singletons[name] ??= value()
  return yolo.__singletons[name]
}

export { db }