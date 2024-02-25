import { Hono } from 'hono'
import { handle } from 'hono/vercel'

// routes grouping
import { user } from './user.route'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

// user route
app.route('/user', user)

app.get('/hono', async (c) => {
  return c.json({
    message: `Hello from HonoJs`,
  })
})

app.post('/hono', async (c) => {
  const payload = await c.req.json()

  return payload
})

app.delete('/hono/:id', async (c) => {
  return c.json({
    message: `Delete hono by id: ${c.req.param('id')}`,
  })
})

app.put('/hono/:slug', async (c) => {
  console.log(c.req.param('slug'))
  return c.json({
    message: `Hello from HonoJs user with id: ${c.req.param('slug')}`,
  })
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
