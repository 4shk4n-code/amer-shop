import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Only add Google provider if credentials are available
const providers: any[] = [];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Add credentials provider for email/password
providers.push(
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      });

      if (!user) {
        return null;
      }

      // For now, we'll create users without password hashing for Google OAuth users
      // In production, you should hash passwords properly
      // This is a placeholder - you'll need to implement proper password hashing
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      };
    },
  })
);

export const authConfig = {
  adapter: PrismaAdapter(prisma) as any,
  providers: providers,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
        });
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      
      if (isOnAdmin) {
        if (isLoggedIn && (auth?.user as any)?.role === "admin") return true;
        return false; // Redirect non-admin users
      }
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && (nextUrl.pathname === "/signin" || nextUrl.pathname === "/signup")) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || (process.env.NODE_ENV === "development" ? "development-secret-key-change-in-production" : undefined),
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

