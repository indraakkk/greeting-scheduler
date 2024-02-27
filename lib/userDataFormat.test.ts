import { describe, expect, it } from 'vitest'

import { faker } from '@faker-js/faker'
import { definePayload } from './userDataFormat'

describe('Defining user payload', () => {
  it('Define user payload for newUser function (birthday)', async () => {
    // test payload
    const first_name = faker.person.firstName()
    const payload = {
      email: faker.internet.email(),
      first_name: first_name,
      last_name: faker.person.lastName(),
      type: 'birthday',
      send_time: '2024-02-26 21:38:00',
      msg: `Happy birthday ${first_name}`,
      tz: 'Asia/Jakarta',
    }

    const result = definePayload(payload, 'newUser')

    // expected data
    const exp = {
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      birthday_msg: payload.msg,
      birthday_tz: payload.tz,
      birthday_send_status: 'init',
      birthday_send_time: payload.send_time,
    }

    expect(result).toStrictEqual(exp)
  })

  it.skip('Define user payload for newUser function (anniversary)', async () => {
    // test payload
    const first_name = faker.person.firstName()
    const payload = {
      email: faker.internet.email(),
      first_name: first_name,
      last_name: faker.person.lastName(),
      type: 'anniversary',
      send_time: '2024-02-26 21:38:00',
      msg: `Happy anniversary ${first_name}`,
      tz: 'Asia/Jakarta',
    }

    const result = definePayload(payload, 'newUser')

    // expected data
    const exp = {
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      anniversary_msg: payload.msg,
      anniversary_tz: payload.tz,
      anniversary_send_status: 'init',
      anniversary_send_time: payload.send_time,
    }

    expect(result).toStrictEqual(exp)
  })

  it.skip('Define user payload for updateUserDetail function (birthday)', async () => {
    // test payload
    const first_name = faker.person.firstName()
    const payload = {
      email: faker.internet.email(),
      first_name: first_name,
      last_name: faker.person.lastName(),
      type: 'birthday',
      send_time: '2024-02-26 21:38:00',
      msg: `Happy birthday ${first_name}`,
      tz: 'Asia/Jakarta',
    }

    const result = definePayload(payload, 'newUser')

    // expected data
    const exp = {
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      birthday_msg: payload.msg,
      birthday_tz: payload.tz,
      birthday_send_status: 'init',
      birthday_send_time: payload.send_time,
    }

    expect(result).toStrictEqual(exp)
  })
})
