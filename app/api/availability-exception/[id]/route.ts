import { requireAdminProvider } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { isAuthorized, user } = await requireAdminProvider();
    if (!isAuthorized || !user) {
      return NextResponse.json({
        message: "User unauthorized",
        status: 401,
        success: false,
      });
    }

    const { id } = await params;
    const availabilityException = await prisma.availabilityException.findUnique(
      {
        where: { id },
      },
    );

    if (!availabilityException) {
      return NextResponse.json({
        message: "Cannot find availability exception",
        status: 404,
        success: false,
      });
    }

    return NextResponse.json({
      message: "AvailabilityException fetched successfully.",
      status: 201,
      success: true,
      data: availabilityException,
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
        message: "Unauthorized user",
        status: 401,
        success: false,
      });
    }

    const { id } = await params;

    const availabilityException = await prisma.availabilityException.findUnique(
      {
        where: { id },
      },
    );

    if (!availabilityException) {
      return NextResponse.json({
        message: "Cannot fine availability Exception",
        status: 404,
        success: false,
      });
    }

    await prisma.availabilityException.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Availability Exception Deleted Successfully.",
      status: 204,
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Internal Server Error",
      status: 500,
      success: false,
    });
  }
}
