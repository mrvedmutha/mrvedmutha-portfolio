import { model, models } from "mongoose";
import type { ISocial } from "@/types/admin/pages/social.types";
import { socialSchema } from "@/schemas/admin/pages/social.schema";

export const Social = models.Social || model<ISocial>("Social", socialSchema);
