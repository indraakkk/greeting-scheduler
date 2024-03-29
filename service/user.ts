import { Context, Env } from 'hono'
import { BlankInput } from 'hono/types'
import { db, eq } from '../db/drizzle'
import { UserModel, users } from '../db/schema'

type ContextType<T extends string> = Context<Env, T, BlankInput>

const getUser = (c: ContextType<'/'>) => {
  return c.text('noice!')
}

type Payload = {
  email: string
  first_name: string
  last_name: string
} & Event

type Event = {
  msg: string
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
      [`${type}_msg`]: payload.msg,
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
      [`${type}_msg`]: payload.msg,
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

// update selected user without checking greeting type
const updateUser = async (
  id: number,
  data: { [key: string]: string | number }
) => {
  try {
    const update = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning()

    return update
  } catch (error) {
    throw new Error(`${error}`)
  }
}

// update user detail based on greeting type
type UpdateUserDetailOpt = {
  [key: string]: string | number
}

type UpdateUserDetail = {
  id: number
  type: string
  msg: string
} & UpdateUserDetailOpt

const updateUserDetail = async (payload: UpdateUserDetail) => {
  try {
    const { type, id } = payload
    const data: UpdateUserDetailOpt = {
      [`${type}_msg`]: payload.msg,
    }

    if (payload.first_name) data.first_name = payload.first_name
    if (payload.last_name) data.last_name = payload.last_name

    const update = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning()

    return update[0] as UserModel
  } catch (error) {
    throw new Error(`${error}`)
  }
}

// delete selected user
const deleteUser = async (id: number) => {
  try {
    const destroy = await db.delete(users).where(eq(users.id, id)).returning()
    console.log(destroy)
    return destroy
  } catch (error) {
    throw new Error(`${error}`)
  }
}

export { newUser, getUser, updateUser, updateUserDetail, deleteUser, addEvent }

// type UserBase = {
//   type: string
// }

// type NewUser = {
//   email: string
// }

// type UpdateUser = {
//   msg: string
// }

// type Onlys = NewUser | UpdateUser

// // const testestste = dynamicTp({type: 'birthday', })

// const xy = <T extends Onlys>(payload: T): UserBase & T => {
//   const data = { type: 'asdasd', ...payload }
//   return data
// }

// // const dynamicTp = <T extends Onlys>(payload: T, action: string): UserBase & T => {

// //   return {
// //     ...payload,
// //   }
// // }

// // const x = dynamicTp({tz: 'asdasd', anything: 'anyanaya'})
// // x.
