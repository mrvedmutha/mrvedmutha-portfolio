import { model, models, Document } from "mongoose";
import { userSchema } from "@/schemas/admin/user.schema";
import type { IUser } from "@/types/models/user.types";

export const User = models.User || model<IUser>("User", userSchema);
