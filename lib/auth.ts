"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const checkAuth = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const { user } = session;
    return {
      user,
      isAuthenticated: true,
    };
  } catch (error) {
    console.log("error", error);
    return { user: null, isAuthenticated: false };
  }
};

export async function requireAdminProvider() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session?.user.role === "CLIENT") {
      return { isAuthorized: false, user: session?.user };
    }
    return { isAuthorized: true, user: session.user };
  } catch (error) {
    console.error(error);
    return { isAuthorized: false, user: null };
  }
}
