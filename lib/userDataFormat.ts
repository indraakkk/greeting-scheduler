// TO DO: define payload
type KindT = {
  [key: string]: () => ObjectT
}

type ObjectT = {
  [key: string]: string | number | undefined
}

const definePayload = (payload: ObjectT, action: string) => {
  const obj: ObjectT = {}

  const kind: KindT = {
    newUser: () => {
      const reqKey = ['email', 'first_name', 'last_name']
      const suffix = ['msg', 'tz', 'send_status', 'send_time']

      suffix.forEach((v) => {
        const val = payload[v]

        if (v === 'send_status') {
          obj[`${payload.type}_${v}`] = 'init'
        } else {
          obj[`${payload.type}_${v}`] = val
        }
      })

      reqKey.forEach((v) => {
        const val = payload[v]
        obj[v] = val
      })

      return obj
    },
    updateUserDetail: () => {
      obj[`${payload.type}_msg`] = payload.msg

      if (payload.first_name) obj.first_name = payload.first_name
      if (payload.last_name) obj.last_name = payload.last_name

      return obj
    },
    addEvent: () => {
      const suffix = ['msg', 'tz', 'send_status']

      suffix.forEach((v) => {
        const val = payload[v]
        obj[`${payload.type}_${v}`] = val
      })

      return obj
    },
  }

  const result = kind[action]?.()

  return result
}

export { definePayload }
