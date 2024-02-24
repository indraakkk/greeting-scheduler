import {Hono } from 'hono'
import {handle} from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.get('/hono', async(c) => {
  return c.json({
    message: `Hello from HonoJs`
  })
})

app.post('/hono', async(c) => {
  return c.json({
    message: `Hello from HonoJs`
  })
})

export default app as never

export const GET = handle(app)
export const POST = handle(app)