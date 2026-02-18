import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    const currentUserId = session?.user.id;

    const users = await prisma.user.findMany({
      where: currentUserId
        ? {
            id: {
              not: currentUserId,
            },
            role: {
              equals: "PROVIDER",
            },
          }
        : {},
      select: {
        id: true,
        availabilities: true,
        email: true,
        name: true,
        role: true,
      },
    });
    console.log(users);

    return NextResponse.json({
      message: "Users fetched successfully.",
      status: 201,
      success: true,
      data: users,
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
