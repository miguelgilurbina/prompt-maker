import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { DefaultSession, Session } from "next-auth"
import type { JWT as NextAuthJWT } from "next-auth/jwt"
import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

type AuthCredentials = {
  email: string
  password: string
}

const prisma = new PrismaClient()

// Extend the built-in session and user types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
    hashedPassword?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    sub?: string
    email?: string | null
    name?: string | null
    picture?: string | null
  }
}

export const authOptions: NextAuthConfig = {
  debug: process.env.NODE_ENV === 'development',
  // Custom logger implementation
  logger: {
    error: (error: Error) => {
      console.error('NextAuth Error:', error);
    },
    warn: (message: string) => {
      console.warn('NextAuth Warning:', message);
    },
    debug: (message: string, metadata?: unknown) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth Debug:', { message, metadata });
      }
    }
  },
  // Using type assertion as a workaround for PrismaAdapter type issues
  // This is a known issue with NextAuth v5 and Prisma
  // @ts-expect-error - PrismaAdapter types are not fully compatible with NextAuth v5 yet
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Authorize called with credentials:', { 
          hasEmail: !!credentials?.email,
          hasPassword: !!credentials?.password 
        });
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Authorize failed: Missing credentials');
          return null
        }
        
        const { email, password } = credentials as AuthCredentials
        console.log('Attempting to authorize user:', email);
        
        try {
          // Find user by email using raw query to bypass Prisma type issues
          console.log('Querying database for user:', email);
          const users = await prisma.$queryRaw<Array<{ id: string; email: string; hashedPassword: string; name: string | null; image: string | null }>>`
            SELECT id, email, "hashedPassword", name, image FROM "User" WHERE email = ${email} LIMIT 1
          `
          
          console.log('Database query result:', { userCount: users.length });
          const user = users[0]

          if (!user || !user.hashedPassword) {
            return null
          }

          // Compare passwords
          const isValid = await bcrypt.compare(password, user.hashedPassword)

          if (!isValid) {
            return null
          }

          // Return user object without the password
          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email?.split('@')[0] || 'User',
            image: null
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: NextAuthJWT }): Promise<Session> {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('Session callback - token:', JSON.stringify(token, null, 2));
        }
        
        if (token?.sub) {
          // Add user ID to session from token
          session.user.id = token.sub;
          
          // Add other user data from token
          if (token.email) session.user.email = token.email;
          if (token.name) session.user.name = token.name;
          if (token.picture) session.user.image = token.picture;
          
          // Only fetch from database if we're missing critical data
          if (!session.user.name || !session.user.email) {
            try {
              const user = await prisma.user.findUnique({
                where: { id: token.sub },
                select: { name: true, email: true, image: true }
              });
              
              if (user) {
                session.user.name = user.name || session.user.name || '';
                session.user.email = user.email || session.user.email || '';
                session.user.image = user.image || session.user.image || null;
              }
            } catch (dbError) {
              console.error('Database error in session callback:', dbError);
              // Don't fail the session if we can't fetch from DB
            }
          }
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Session callback - final session:', JSON.stringify(session, null, 2));
        }
        
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        // Return a minimal valid session on error
        return {
          ...session,
          user: {
            id: token?.sub || '',
            email: token?.email || null,
            name: token?.name || null,
            image: token?.picture || null
          }
        };
      }
    },
    async jwt({ token, user, trigger, session }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('JWT callback - trigger:', trigger);
        console.log('JWT callback - input token:', JSON.stringify(token, null, 2));
        if (user) console.log('JWT callback - user:', JSON.stringify(user, null, 2));
      }
      
      try {
        // Initial sign in
        if (user) {
          token.sub = user.id;
          token.email = user.email || null;
          token.name = user.name || null;
          token.picture = user.image || null;
        }
        
        // Update token with data from session if this is a session update
        if (trigger === 'update' && session?.user) {
          if (process.env.NODE_ENV === 'development') {
            console.log('JWT update - session.user:', JSON.stringify(session.user, null, 2));
          }
          token = { 
            ...token, 
            email: session.user.email || token.email,
            name: session.user.name || token.name,
            picture: session.user.image || token.picture
          };
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('JWT callback - final token:', JSON.stringify(token, null, 2));
        }
        
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        // Return the original token on error
        return token;
      }
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error"
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-key"
}
