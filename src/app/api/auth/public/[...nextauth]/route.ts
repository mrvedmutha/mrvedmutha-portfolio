import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/admin/user.model";

// Public authentication for comment users only (Google & GitHub)
export const publicAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.provider = account?.provider;
        
        // Check if this email belongs to an admin user
        try {
          await dbConnect();
          const adminUser = await User.findOne({ email: user.email?.toLowerCase() });
          if (adminUser && adminUser.role === 'admin') {
            token.role = 'admin';
            token.isAdmin = true;
            token.adminId = adminUser._id.toString();
          } else {
            token.role = 'public';
            token.isAdmin = false;
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          token.role = 'public';
          token.isAdmin = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.provider = token.provider as string;
        session.user.role = token.role as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.adminId = token.adminId as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Only allow Google and GitHub sign-ins for public auth
      return account?.provider === 'google' || account?.provider === 'github';
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    // No custom pages - use default NextAuth pages
    signIn: '/api/auth/public/signin',
    error: '/api/auth/public/error',
  },
};

const handler = NextAuth(publicAuthOptions);
export { handler as GET, handler as POST };