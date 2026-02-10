import CredentialProviders from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProviders({
      name: "Credentials",

      credentials: {
        email: { label: "email", type: "text", placeholder: "email" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) {
        const { email, password } = credentials ?? {};
        console.log(credentials, "credentials");
        if (!email || !password) throw new Error("Missing Credentials");
        const user = await login(email, password);
        if (!user) {
          throw new Error("Invalid credentials");
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          username: user.username,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

async function login(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        country: true,
        timezone: true,
        username: true,
        password: true,
      },
    });
    //console.log("user first:", user)
    if (!user || !user.password) return null;
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;
    return user;
  } catch (error) {
    return null;
  }
}
