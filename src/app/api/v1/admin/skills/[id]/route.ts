import { NextRequest } from "next/server";
import { getSkillById, updateSkillById } from "@/lib/db/skills";
import { skillZodSchema } from "@/schemas/zod/admin/pages/skill.zod.schema";
import { getServerSession } from "next-auth";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) return FailureResponse("Unauthorized", 401);
  try {
    const skill = await getSkillById(params.id);
    if (!skill) return FailureResponse("Skill not found", 404);
    return SuccessResponse(skill);
  } catch (err) {
    return FailureResponse("Failed to fetch skill", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) return FailureResponse("Unauthorized", 401);
  try {
    const body = await req.json();
    const parse = skillZodSchema.safeParse(body);
    if (!parse.success) {
      return FailureResponse("Invalid data", 400);
    }
    const updated = await updateSkillById(params.id, parse.data);
    if (!updated) return FailureResponse("Skill not found", 404);
    return SuccessResponse(updated);
  } catch (err) {
    return FailureResponse("Failed to update skill", 500);
  }
}
