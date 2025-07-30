import { User } from "@/models/admin/user.model";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/db";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, res: any): Promise<any> {
        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });
          if (!user || !user.password) {
            console.error(
              "User not found or password missing:",
              credentials.email
            );
            return null;
          }
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            console.error("Invalid password for:", credentials.email);
            return null;
          }
          return user;
        } catch (error: any) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
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
        // For OAuth providers (Google/GitHub), find the admin user in database
        if (account?.provider && (account.provider === 'google' || account.provider === 'github')) {
          try {
            await dbConnect();
            const adminUser = await User.findOne({ email: user.email?.toLowerCase() });
            if (adminUser) {
              token.id = adminUser._id.toString();
              token.role = adminUser.role;
              token.name = adminUser.name || user.name || 'Admin';
            } else {
              // If no admin user found, use OAuth user info but set role as 'public'
              token.id = user.id;
              token.role = 'public';
              token.name = user.name;
            }
          } catch (error) {
            console.error('Error finding admin user:', error);
            token.id = user.id;
            token.role = 'public';
            token.name = user.name;
          }
        } else {
          // For credentials login, use user data directly
          token.id = user._id || user.id;
          token.role = user.role;
          token.name = user.name;
        }
        token.email = user.email;
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};
