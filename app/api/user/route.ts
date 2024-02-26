import { NextResponse } from 'next/server'
import { newUser } from '../../../service/user'

export async function POST() {
  try {
    // store new user
    const data = await newUser()

    // add to cron

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

export async function DELETE() {
  try {
    // delete selected use
    // stop cron job for selected user
  } catch (error) {}
}

export async function PUT() {
  try {
    // update user message
    // stop cron job for selected user
  } catch (error) {}
}
