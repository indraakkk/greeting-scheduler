import {
  serial,
  pgTable,
  varchar,
  index,
  timestamp,
  text,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  first_name: varchar('first_name', { length: 256 }),
  last_name: varchar('last_name', { length: 256 }),

  birthday_msg: text('birthday_msg'),
  birthday_send_status: varchar('birthday_send_status', { length: 256 }),
  birthday_send_time: varchar('birthday_send_time', { length: 256 }),
  birthday_tz: varchar('birthday_tz', { length: 256 }),

  anniversary_msg: text('anniversary_msg'),
  anniversary_send_status: varchar('anniversary_send_status', { length: 256 }),
  anniversary_send_time: varchar('anniversary_send_time', { length: 256 }),
  anniversary_tz: varchar('anniversary_tz', { length: 256 }),

  created_at: timestamp('created_at', {
    mode: 'date',
    withTimezone: false,
  }).defaultNow(),
})

export type UserModel = typeof users.$inferSelect
export type InsertUserModel = typeof users.$inferInsert
