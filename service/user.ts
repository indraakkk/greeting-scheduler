import { Context, Env } from 'hono'
import { BlankInput } from 'hono/types'
import { db, eq } from '../db/drizzle'
import { UserModel, users } from '../db/schema'

type ContextType<T extends string> = Context<Env, T, BlankInput>

const getUser = (c: ContextType<'/'>) => {
  return c.text('noice!')
}

type Payload = {
  id?: number
  email: string
  first_name: string
  last_name: string
} & Event

type Event = {
  message: string
  tz: string
  type: string
  send_time: string
}

type AddEvent = {
  id: number
} & Event

// const newUser = async (c: ContextType<'/'>) => {  //can't continue to use honojs-edgefunction | node:crypto error
const newUser = async (payload: Payload) => {
  try {
    // define data with message: 'birthday_msg | anniversary_msg'
    const { type } = payload

    // insert new user data
    const data = {
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      [`${type}_msg`]: payload.message,
      [`${type}_tz`]: payload.tz,
      [`${type}_send_status`]: 'init',
      [`${type}_send_time`]: payload.send_time,
    }

    const store = await db.insert(users).values(data).returning()

    return store[0] as UserModel
  } catch (error) {
    throw new Error(`${error}`)
  }
}

// add birthday | anniversary event to existing user
const addEvent = async (payload: AddEvent) => {
  try {
    const { type, id } = payload

    const data = {
      [`${type}_msg`]: payload.message,
      [`${type}_tz`]: payload.tz,
      [`${type}_send_status`]: 'init',
    }
    const update = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning()
    console.log(update)
    return update
  } catch (error) {
    throw new Error(`${error}`)
  }
}

// add birthday | anniversary event to existing user
const deleteUser = async (id: number) => {
  try {
    const destroy = await db.delete(users).where(eq(users.id, id)).returning()
    console.log(destroy)
    return destroy
  } catch (error) {
    throw new Error(`${error}`)
  }
}

export { newUser, getUser, deleteUser, addEvent }
