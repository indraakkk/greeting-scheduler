import { NextRequest, NextResponse } from 'next/server'
import { deleteUser, newUser } from '../../../service/user'
import { UserModel, users } from '../../../db/schema'
import * as cron from 'cron'
import { db, eq } from '../../../db/drizzle'
import moment from 'moment'

export async function POST(req: NextRequest) {
  try {
    // store new user
    const payload = await req.json()

    const data = await newUser(payload)

    // add to cron
    cronJob(data)

    return NextResponse.json({
      success: true,
      message: 'Successfully store new user',
      data: data,
    })
  } catch (error) {
    const e = error as Error
    return NextResponse.json({ message: e.message }, { status: 500 })
  }
}

const cronJob = (data: UserModel) => {
  const sendMessage = async (email: string, message: string) => {
    const data = {
      email: email,
      message: message,
    }

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

    return Response.json(result)
  }

  const cronExe = (
    time: string,
    tz: string,
    email: string,
    message: string
  ) => {
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
      cronTimeStr,
      () => {
        // run fetch;
        sendMessage(email, message)
      },
      () => {
        job.stop
      },
      true,
      tz
    )
  }

  const type = ['birthday', 'anniversary']

  type.forEach(async (t) => {
    const send_status = `${t}_send_status` as keyof UserModel
    const send_time = `${t}_send_time` as keyof UserModel
    const message = `${t}_message` as keyof UserModel
    const tz = `${t}_tz` as keyof UserModel

    if (data[send_status] === 'init') {
      // run node cron
      cronExe(
        data[send_time] as string, // format "2024-02-27 09:20:00"
        data[tz] as string,
        data.email,
        data[message] as string
      )

      // update status
      await db
        .update(users)
        .set({ [send_status]: 'process' })
        .where(eq(users.id, data.id))
    }
  })
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()

    // delete selected use
    const data = await deleteUser(id)

    // stop cron job for selected user

    return NextResponse.json({
      success: true,
      message: 'Successfully delete user',
      data: data,
    })
  } catch (error) {
    const e = error as Error
    return NextResponse.json({ message: e.message }, { status: 500 })
  }
}

export async function PUT() {
  try {
    // update user data
  } catch (error) {}
}
