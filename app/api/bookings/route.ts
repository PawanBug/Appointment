import { requireAdminProvider } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createbookingSchema } from "@/lib/validators/booking";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAdminProvider();
    if (!user) {
      return NextResponse.json({
        message: "Unauthorized",
        status: "401",
        success: false,
      });
    }

    const where: Prisma.BookingWhereInput = {};

    if (user.role === "CLIENT") {
      where.clientId = user.id;
    }

    if (user.role === "PROVIDER") {
      where.OR = [{ providerId: user.id }, { clientId: user.id }];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        timeSlot: true,
        client: true,
        provider: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "Bookings fetched successfully.",
      status: 201,
      success: true,
      data: bookings,
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

    const body = req.json();
    const { success, data } = createbookingSchema.safeParse(body);
    if (!success) {
      return NextResponse.json({
        message: "Invalid request",
        status: 400,
        success: false,
      });
    }

    const booking = await prisma.booking.create({
      data: {
        providerId: data.providerId,
        clientId: data.clientId,
        timeSlotId: data.timeSlotId,
        Status: data.Status,
        notes: data.notes,
      },
    });

    return NextResponse.json({
      message: "Booking created successfully.",
      status: 201,
      success: true,
      data: booking,
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
