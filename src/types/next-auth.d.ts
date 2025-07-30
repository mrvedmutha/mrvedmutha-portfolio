import "next-auth";
import { DefaultSession } from "next-auth";
import "next";

declare module "next-auth" {
  interface User {
    _id?: string;
    email?: string;
    role?: string;
    provider?: string;
    isAdmin?: boolean;
    adminId?: string;
  }
  interface Session {
    user: {
      _id?: string;
      email?: string;
      role?: string;
      provider?: string;
      isAdmin?: boolean;
      adminId?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    id?: string;
    email?: string;
    role?: string;
    provider?: string;
    isAdmin?: boolean;
    adminId?: string;
  }
}

declare module "next/server" {
  interface NextRequest {
    session: {
      user: any;
    };
  }
}
