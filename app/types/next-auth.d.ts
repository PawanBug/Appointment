import { StringToBoolean } from "class-variance-authority/types";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      username: string;
      role: string;
      email: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    role: string;
    expiresAt?: number;
    username: string;
  }
}
