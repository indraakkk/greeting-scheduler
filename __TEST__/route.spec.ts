import { describe, expect, it } from 'vitest'

describe('GET request', () => {
  it('GET http://localhost/api/hono is ok', async () => {
    const res = await fetch('http://localhost:3000/api/hono')
    const result = await res.json()

    expect(res.status).toBe(200)
  })

  it('GET http://localhost/api/hono valid message', async () => {
    const res = await fetch('http://localhost:3000/api/hono')
    const result = await res.json()

    expect(result).toEqual({
      message: 'Hello from HonoJs',
    })
  })
})
