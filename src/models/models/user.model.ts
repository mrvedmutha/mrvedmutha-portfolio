import { model, models } from "mongoose";
import { userSchema } from "@/schemas/mongodb/user.schema";
import type { IUser } from "@/types/models/user.types";

export const User = models.User || model<IUser>("User", userSchema);
