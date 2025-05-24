import { Types } from "mongoose";
import { UserRole } from "@/enums/user.enum";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
