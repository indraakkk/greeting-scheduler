import { serial, pgTable, varchar, index } from 'drizzle-orm/pg-core';

export const usersTable = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 256 }).unique().notNull(),
    status: varchar('status', { length: 256 }),
  },
  (table) => {
    return {
      emailIndex: index('users_email_index').on(table.email),
    };
  }
);

export type UserModel = typeof usersTable.$inferSelect;
export type InsertUserModel = typeof usersTable.$inferInsert;
