import { requireAdminProvider } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updatebookingSchema } from "@/lib/validators/booking";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({
        message: "Booking not found",
        status: 404,
        success: false,
      });
    }

    return NextResponse.json({
      message: "Booking fetched successfully.",
      status: 200,
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { isAuthorized, user } = await requireAdminProvider();
    if (!isAuthorized || !user) {
      return NextResponse.json({
        message: "Unauthorized",
        status: 401,
        success: false,
      });
    }
    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
    });
    if (!booking) {
      return NextResponse.json({
        message: "Booking not found",
        status: 404,
        success: false,
      });
    }
    const body = req.json();
    const { success, data } = updatebookingSchema.safeParse(body);

    if (!success) {
      return NextResponse.json({
        message: "Invalid Request",
        status: 400,
        success: false,
      });
    }
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        clientId: data.clientId,
        providerId: data.providerId,
        timeSlotId: data.timeSlotId,
        Status: data.Status,
        notes: data.notes,
      },
    });

    return NextResponse.json({
      message: "Booking updated successfully",
      status: 201,
      success: true,
      data: updatedBooking,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { isAuthorized, user } = await requireAdminProvider();

    if (!isAuthorized || !user) {
      return NextResponse.json({
        message: "Unauthorized user",
        status: 401,
        success: false,
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({
        message: "Time slot doesnot exist.",
        status: 404,
        success: false,
      });
    }

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Booking deleted successfully.",
      status: 204,
      success: true,
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
