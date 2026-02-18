import { createAvailabilityExceptionSchema } from "@/app/types/availability-exception";
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
      where: { userId, date: {} },
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
