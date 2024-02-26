import moment from 'moment'
import { UserModel } from '../db/schema'
import { updateUser } from '../service/user'
import * as cron from 'cron'

const sendMessage = async (email: string, message: string) => {
  console.log('in send message function')
  const data = {
    email: email,
    message: message,
  }

  console.log(data)

  const req = await fetch(
    'https://email-service.digitalenvision.com.au/send-email',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  )

  const result = await req.json()
  console.log(result)
}

const cronExe = (time: string, tz: string, email: string, message: string) => {
  const m = moment(time)
  const minute = m.minutes()
  const hour = m.hours()
  const day = m.format('DD')
  const month = m.format('M')

  const cronTimeStr = `* ${minute} ${hour} ${day} ${month} *`

  console.log([minute, hour, day, month, m.format('DD-MM-YY hh:mm')])
  console.log(cronTimeStr)

  const job = new cron.CronJob(
    // '1 * * * * *', // cron time
    `0 ${minute} ${hour} ${day} ${month} *`,
    async () => {
      // run fetch;
      console.log('run send message')
      await sendMessage(email, message)
    },
    () => {
      job.stop
    },
    true,
    tz
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
      cronExe(
        data[send_time] as string, // format "2024-02-27 09:20:00"
        data[tz] as string,
        data.email,
        data[message] as string
      )

      // update status
      const userObj = { [send_status]: 'process' }

      await updateUser(data.id, userObj)
    }
  })
}

export { cronJob }
