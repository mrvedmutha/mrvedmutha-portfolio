import "next-auth";
import { DefaultSession } from "next-auth";
import "next";
declare module "next-auth" {
  interface User {
    _id?: string;
    email?: string;
    role?: string;
  }
  interface Session {
    user: {
      _id?: string;
      email?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    email?: string;
    role?: string;
  }
}
declare module "next-auth/next" {
  interface NextRequest {
    session: {
      user: any;
    };
  }
}
