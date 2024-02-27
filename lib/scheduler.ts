import moment from 'moment'
import { UserModel } from '../db/schema'
import { updateUser } from '../service/user'
import * as cron from 'cron'

type DataArgType = {
  id: number
  [key: string]: string | number | undefined
}

const sendMessage = async (data: DataArgType) => {
  console.log('in send message function')

  const { email, message } = data

  const sendData = {
    email: email,
    message: message,
  }

  const send_email_url = process.env.SEND_EMAIL_URL as string

  try {
    const req = await fetch(send_email_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendData),
    })

    const result = await req.json()

    // update user data
    const status = { [`${data.type}_send_status`]: 'success' }
    await updateUser(data.id, status)

    console.log(result)
    return result
  } catch (error) {
    const e: Error = error as Error
    throw new Error(e.message)
  }
}

const cronExe = (data: DataArgType) => {
  const { time, id, email, message, type, tz } = data

  const m = moment(time)
  const minute = m.minutes()
  const hour = m.hours()
  const day = m.date()
  const month = m.format('M')

  console.log([minute, hour, day, month, time])
  console.log(`0 ${minute} ${hour} ${day} ${month} *`)

  const job = new cron.CronJob(
    // '1 * * * * *', // cron time
    `0 ${minute} ${hour} ${day} ${month} *`,
    async () => {
      // run fetch;
      console.log('run send message')
      const dataToUpdate = {
        id: id,
        email: email,
        message: message,
        type: type,
      }
      await sendMessage(dataToUpdate)
    },
    () => {
      job.stop
    },
    true,
    tz as string
  )
}

const cronJob = (data: UserModel) => {
  const type = ['birthday', 'anniversary']

  type.forEach(async (t) => {
    const send_status = `${t}_send_status` as keyof UserModel

    if (data[send_status] === 'init') {
      const send_time = `${t}_send_time` as keyof UserModel
      const message = `${t}_msg` as keyof UserModel
      const tz = `${t}_tz` as keyof UserModel

      // run node cron
      const cronData = {
        id: data.id,
        time: data[send_time] as string, // format "2024-02-27 09:20:00"
        tz: data[tz] as string,
        email: data.email,
        message: data[message] as string,
        type: t,
      }

      cronExe(cronData)

      // update status
      const userObj = { [send_status]: 'process' }

      await updateUser(data.id, userObj)
    }
  })
}

export { cronJob }
