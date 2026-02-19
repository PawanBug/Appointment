import { createAvailabilityExceptionSchema } from "@/app/types/availability-exception";
import { requireAdminProvider } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const searchParamsObject = Object.fromEntries(searchParams);
    const { success, data } = z
      .object({
        userId: z.string().min(1, "Provide correct userId"),
      })
      .safeParse(searchParamsObject);

    if (!success) {
      return NextResponse.json({
        message: "Invalid user data",
        status: 400,
        success: false,
      });
    }
    const { userId } = data;

    const availabityExceptions = await prisma.availabilityException.findMany({
      where: { userId },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      message: "Availbility Exception fetched successfully.",
      status: 201,
      success: true,
      data: availabityExceptions,
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
        message: "Unauthorized",
        status: 401,
        success: false,
      });
    }

    const body = await req.json();

    const { success, data } = createAvailabilityExceptionSchema.safeParse(body);
    if (!success) {
      return NextResponse.json({
        message: "Invalid request data",
        status: 400,
        success: false,
      });
    }

    const { startTime, date, endTime, reason, userId } = data;
    const availabilityException = await prisma.availabilityException.create({
      data: {
        date,
        startTime,
        endTime,
        userId,
        reason,
      },
    });

    return NextResponse.json({
      message: "AvailabilityException created successfully.",
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
