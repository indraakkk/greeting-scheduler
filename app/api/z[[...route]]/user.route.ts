// import service here
import { getUser, newUser } from '../../../service/user'

import { Hono } from 'hono'

const user = new Hono()

user.get('/', (c) => getUser(c))

user.get('/:id', (c) => {
  const id = c.req.param('id')
  return c.text(`Get book by ${id}`)
})

user.post('/', (c) => newUser(c))

user.put('/:id', (c) => {
  const id = c.req.param('id')
  return c.text(`Update user id: ${id}`)
})

user.delete('/:id', (c) => {
  const id = c.req.param('id')
  return c.text(`Delete user id: ${id}`)
})

export { user }
