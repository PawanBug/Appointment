import { createAvailabilityRuleSchema } from "@/lib/validators/availability-rule";
import { requireAdminProvider } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const { success, data } = z
      .object({
        userId: z.string(),
        day: z.coerce.number().int().min(0).max(6).optional(),
      })
      .safeParse(searchParamsObject);

    if (!success) {
      return NextResponse.json({
        message: "Invalid Request",
        status: 400,
        success: false,
      });
    }

    const { userId, day } = data;
    const whereClause: Prisma.AvailabilityRuleWhereInput = {};

    whereClause.userId = userId;
    if (day) {
      whereClause.dayOfWeek = day;
    }
    const availabilities = await prisma.availabilityRule.findMany({
      where: whereClause,
    });

    console.log("availability", availabilities);
    return NextResponse.json({
      message: "Availabilities fetched Successfully.",
      status: 201,
      success: true,
      data: availabilities,
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
    if (!isAuthorized) {
      return NextResponse.json({
        message: "User not authorized.",
        status: 401,
        success: false,
      });
    }
    if (!user) {
      return NextResponse.json({
        message: "User cant be found.",
        status: 401,
        success: false,
      });
    }
    const body = await req.json();
    const { success, data } = createAvailabilityRuleSchema.safeParse(body);
    if (!success) {
      return NextResponse.json({
        message: "Invalid request",
        status: 400,
        success: false,
      });
    }

    const availability = await prisma.availabilityRule.create({
      data: {
        userId: user.id,
        dayOfWeek: data.dayOfWeek,
        endTime: data.endTime,
        startTime: data.startTime,
        slotSize: data.slotSize,
      },
    });

    return NextResponse.json({
      message: "Availability Rule Created Successfully.",
      status: 201,
      success: true,
      data: availability,
    });

    //schema for creating Availability
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({
      message: "Internal Server Error",
      status: 500,
      success: false,
    });
  }
}
