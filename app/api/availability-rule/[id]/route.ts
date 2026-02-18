import { updateAvailabilityRuleSchema } from "@/app/types/availability-rule";
import { requireAdminProvider } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
    const body = await req.json();

    const { success, data } = updateAvailabilityRuleSchema.safeParse(body);
    if (!success) {
      return NextResponse.json({
        message: "Invalid Request",
        status: 400,
        success: false,
      });
    }

    const availabilityRule = await prisma.availabilityRule.findUnique({
      where: { id },
    });

    if (!availabilityRule) {
      return NextResponse.json({
        message: "Availablity Rule with that Id doesnot exist.",
        status: 404,
        success: false,
      });
    }

    const updatedAvailabilityRule = await prisma.availabilityRule.update({
      where: { id },
      data: {
        dayOfWeek: data.dayOfWeek,
        endTime: data.endTime,
        startTime: data.startTime,
        slotSize: data.slotSize,
      },
    });

    return NextResponse.json({
      message: "Updated availability rule successfully.",
      success: true,
      status: 201,
      data: updatedAvailabilityRule,
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const availabilityRule = await prisma.availabilityRule.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!availabilityRule) {
      return NextResponse.json({
        message: "Availability Rule doesnot exist.",
        status: 404,
        success: false,
      });
    }

    return NextResponse.json({
      message: "Availability Rule fetched successfully.",
      status: 201,
      success: true,
      data: availabilityRule,
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
    const { isAuthorized, user } = await requireAdminProvider();
    if (!isAuthorized || !user) {
      return NextResponse.json({
        message: "User not authorized.",
        status: 401,
        success: false,
      });
    }

    const { id } = await params;

    const availabilityRule = await prisma.availabilityRule.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!availabilityRule) {
      return NextResponse.json({
        message: "Availability rule not found.",
        status: 404,
        success: false,
      });
    }

    await prisma.availabilityRule.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "AvailabilityRule deleted successfully.",
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
