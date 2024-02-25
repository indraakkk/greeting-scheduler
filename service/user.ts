import { Context, Env } from 'hono'
import { BlankInput } from 'hono/types'

type ContextType<T extends string> = Context<Env, T, BlankInput>

const getUser = (c: ContextType<'/'>) => {
  return c.text('noice!')
}

const newUser = (c: ContextType<'/:id'>) => {
  try {
    throw new Error('failed')
  } catch (error) {
    const e = error as Error

    return c.json(
      {
        message: e.message,
        success: false,
      },
      500
    )
  }
}

export { newUser, getUser }
