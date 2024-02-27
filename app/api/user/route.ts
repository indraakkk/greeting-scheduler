import { NextRequest, NextResponse } from 'next/server'
import { deleteUser, newUser, updateUserDetail } from '../../../service/user'
import { cronJob } from '../../../lib/scheduler'

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

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()

    // delete selected use
    const data = await deleteUser(id)

    // TO DO: stop cron job for selected user

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

export async function PUT(req: NextRequest) {
  try {
    // update user data
    /**
     * payload example
     *
     * {
     *   "id": 43,
     *   "type": "birthday",
     *   "message": "Heavy Beerday John!",
     *   "first_name": "john", // optional
     *   "last_name": "doe" // optional
     * }
     *
     */

    const payload = await req.json()

    const data = await updateUserDetail(payload)

    // TO DO: update user detail to CRON job if still running

    return NextResponse.json({
      success: true,
      message: 'Successfully update user',
      data: data,
    })
  } catch (error) {
    const e = error as Error
    return NextResponse.json({ message: e.message }, { status: 500 })
  }
}
