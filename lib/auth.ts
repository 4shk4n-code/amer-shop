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
      // Ensure proper callback handling for Vercel
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
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

      const email = credentials.email as string;
      const password = credentials.password as string;

      try {
        if (!prisma) {
          console.warn('Prisma not available, cannot authenticate');
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        // If user has no password (OAuth-only user), reject
        if (!user.password) {
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      } catch (error) {
        console.error('Database error in authorize:', error);
        return null;
      }
    },
  })
);

// Temporarily disable PrismaAdapter to get the site working
// We'll re-enable it once Prisma connection is fixed
let adapter: any = undefined;
// TODO: Re-enable adapter once Prisma connection is working
// try {
//   if (process.env.DATABASE_URL) {
//     adapter = PrismaAdapter(prisma) as any;
//   }
// } catch (error) {
//   console.warn('PrismaAdapter initialization failed, using JWT-only mode:', error);
//   adapter = undefined;
// }

export const authConfig = {
  adapter: adapter,
  providers: providers,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token, user }) {
      // Skip database entirely if adapter is disabled (JWT-only mode)
      if (!adapter) {
        if (token.role) {
          (session.user as any).role = token.role;
        }
        if (token.sub) {
          (session.user as any).id = token.sub;
        }
        return session;
      }
      
      // Only query database if adapter is enabled and Prisma is available
      if (session.user && prisma) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
          });
          if (dbUser) {
            session.user.id = dbUser.id;
            session.user.role = dbUser.role;
          }
        } catch (error) {
          // If database query fails, use token data instead
          console.warn('Database query failed in session callback, using token:', error);
          if (token.role) {
            (session.user as any).role = token.role;
          }
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

