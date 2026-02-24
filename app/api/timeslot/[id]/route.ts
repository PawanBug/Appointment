import { requireAdminProvider } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id },
    });

    if (!timeSlot) {
      return NextResponse.json({
        message: "Timeslot not found",
        status: 404,
        success: false,
      });
    }

    return NextResponse.json({
      message: "Time slot fetched successfully",
      status: 201,
      success: true,
      data: timeSlot,
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

    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id },
    });

    if (!timeSlot) {
      return NextResponse.json({
        message: "Time slot doesnot exist.",
        status: 404,
        success: false,
      });
    }

    await prisma.timeSlot.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Time slot deleted successfully.",
      status: 201,
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
