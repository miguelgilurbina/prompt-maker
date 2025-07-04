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
        console.log('\n🔑 Authorization attempt started');
        
        if (!credentials?.email || !credentials?.password) {
          const error = new Error('Email and password are required');
          console.error('❌ Authorization failed:', error.message);
          throw error;
        }
        
        const { email, password } = credentials as AuthCredentials;
        console.log(`🔍 Looking up user: ${email}`);
        
        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
            select: { 
              id: true, 
              email: true, 
              name: true, 
              image: true, 
              hashedPassword: true,
              emailVerified: true
            }
          });

          if (!user) {
            const error = new Error('Invalid email or password');
            console.error(`❌ User not found: ${email}`);
            throw error;
          }

          if (!user.hashedPassword) {
            const error = new Error('No password set for this account');
            console.error('❌ No password hash found for user:', user.id);
            throw error;
          }

          console.log(`🔑 Found user: ${user.id}`);
          console.log(`   Email verified: ${user.emailVerified ? '✅' : '❌'}`);
          
          // Compare passwords
          console.log('🔒 Verifying password...');
          const isValid = await bcrypt.compare(password, user.hashedPassword);
          
          if (!isValid) {
            console.error('❌ Invalid password for user:', user.id);
            return null;
          }

          console.log('✅ Password verified successfully');
          
          // Return user object without the password
          const userWithoutPassword = {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            emailVerified: user.emailVerified
          };
          
          console.log('🎉 Authentication successful!');
          console.log('   User data:', JSON.stringify(userWithoutPassword, null, 2));
          
          return userWithoutPassword;
        } catch (error) {
          console.error('❌ Unexpected error during authorization:', error);
          // Don't leak sensitive error details to client
          throw new Error('Authentication failed. Please try again.');
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      console.log('🔍 Session callback triggered');
      
      try {
        if (token?.sub) {
          // Add user ID to session from token
          session.user.id = token.sub;
          
          // Add other user data from token
          if (token.email) session.user.email = token.email;
          if (token.name) session.user.name = token.name;
          if (token.picture) session.user.image = token.picture;
          
          // Add email verification status if available
          if ('emailVerified' in token) {
            // @ts-expect-error - Extending session type
            session.user.emailVerified = token.emailVerified;
          }
          
          console.log('✅ Session data updated with token info');
        }
        
        console.log('🔑 Final session data:', JSON.stringify(session, null, 2));
        return session;
        
      } catch (error) {
        console.error('❌ Error in session callback:', error);
        return session;
      }
    },
    
    async jwt({ token, user, trigger, session }: { 
      token: JWT; 
      user?: User; 
      trigger?: 'signIn' | 'signUp' | 'update';
      session?: { user?: Partial<User> };
    }): Promise<JWT> {
      console.log('🔑 JWT callback triggered');
      
      try {
        // Initial sign in
        if (user) {
          console.log('🔑 Processing new sign in');
          token.sub = user.id;
          token.email = user.email || null;
          token.name = user.name || null;
          token.picture = user.image || null;
          
          // Add email verification status if available
          // Add email verification status if available in the user object
          if (user && 'emailVerified' in user) {
            // We're safely extending the JWT type with emailVerified
            const verifiedValue = user.emailVerified;
            if (verifiedValue instanceof Date || verifiedValue === null) {
              (token as JWT & { emailVerified?: Date | null }).emailVerified = verifiedValue;
            }
          }
        }
        
        // Handle session updates (e.g., from client-side session updates)
        if (trigger === 'update' && session?.user) {
          console.log('🔄 Updating token with new session data');
          return {
            ...token,
            email: session.user.email || token.email,
            name: session.user.name || token.name,
            picture: session.user.image || token.picture
          };
        }
        
        console.log('✅ Final token data:', JSON.stringify(token, null, 2));
        return token;
        
      } catch (error) {
        console.error('❌ Error in JWT callback:', error);
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
