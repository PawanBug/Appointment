"use server";

import prisma from "@/lib/prisma";
import { userInput } from "@/lib/validators/user-validation";
import bcrypt from "bcryptjs";

export async function createUser(data: userInput) {
  try {
    const { name, username, email, password, phoneNumber, country } = data;

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) {
      return {
        message: "User with that email already exists.",
        status: 400,
        success: false,
      };
    }

    const phoneNoExists = await prisma.user.findUnique({
      where: { phoneNumber },
    });
    if (phoneNoExists) {
      return {
        message: "User with that phone number already exists.",
        status: 400,
        success: false,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        country,
      },
    });

    return {
      data: newUser,
      success: true,
      status: 201,
      message: "User created successfuly.",
    };
  } catch (error) {
    console.log("error:", error);
    return {
      success: false,
      status: 500,
      message: "Internal server error.",
    };
  }
}
