import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { DefaultSession, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

type AuthCredentials = {
  email: string
  password: string
}

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

}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string
    email?: string | null
    name?: string | null
    picture?: string | null
  }
}

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  // Custom logger implementation
  logger: {
    error: (code: string, metadata: Error | { [key: string]: unknown; error: Error; }) => {
      console.error('NextAuth Error:', metadata);
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

  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const { email, password } = credentials as AuthCredentials;
        
        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
            select: { 
              id: true, 
              email: true, 
              name: true, 
              image: true, 
              hashedPassword: true 
            }
          });

          if (!user?.hashedPassword) {
            return null;
          }

          // Compare passwords
          const isValid = await bcrypt.compare(password, user.hashedPassword);

          if (!isValid) {
            return null;
          }

          // Return user object without the password
          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email?.split('@')[0] || 'User',
            image: user.image
          } as User;
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      try {
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
            }
          }
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
    async jwt({ token, user, trigger, session }): Promise<JWT> {
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
          return { 
            ...token, 
            email: session.user.email || token.email,
            name: session.user.name || token.name,
            picture: session.user.image || token.picture
          } as JWT;
        }
        
        return token as JWT;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token as JWT;
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
