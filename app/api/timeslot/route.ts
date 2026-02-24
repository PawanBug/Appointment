import { createTimeSlotSchema } from "@/lib/validators/timeslot";
import { requireAdminProvider } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const searchParamsObject = Object.fromEntries(searchParams.entries());

    const { success, data } = z
      .object({
        userId: z.string(),
      })
      .safeParse(searchParamsObject);

    if (!success) {
      return NextResponse.json({
        message: "Invalid Request",
        status: 400,
        success: false,
      });
    }
    const { userId } = data;
    const timeSlots = await prisma.timeSlot.findMany({
      where: { userId },
    });

    return NextResponse.json({
      message: "TimeSlots fetched Successfully.",
      status: 201,
      success: true,
      data: timeSlots,
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({
      message: "Internal Server Error",
      status: 500,
      success: false,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { isAuthorized, user } = await requireAdminProvider();

    if (!isAuthorized || !user) {
      return NextResponse.json({
        message: "Unauthorized user",
        status: 401,
        success: false,
      });
    }

    const body = await req.json();
    const { success, data } = createTimeSlotSchema.safeParse(body);

    if (!success) {
      return NextResponse.json({
        message: "Invalid request data",
        status: 400,
        success: false,
      });
    }

    const timeslot = await prisma.timeSlot.create({
      data: {
        date: data.date,
        endTime: data.endTime,
        startTime: data.startTime,
        isBooked: data.isBooked,
        bookingId: data.bookingId,
        userId: data.userId,
      },
    });

    return NextResponse.json({
      message: "Time slot created successfully.",
      status: 201,
      success: true,
      data: timeslot,
    });
  } catch {
    return NextResponse.json({
      message: "Internal Server Error",
      status: 500,
      success: false,
    });
  }
}
