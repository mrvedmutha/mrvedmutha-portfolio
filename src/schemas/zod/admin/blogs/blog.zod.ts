import { z } from "zod";
import { BlogStatus } from "@/enums/admin/blogs/status.enum";

export const AuthorZod = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().optional(),
});

export const CategoryZod = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
});

export const TagZod = z.object({
  id: z.string(),
  name: z.string(),
});

export const CommentUserZod = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().optional(),
});

export const CommentZod = z.object({
  _id: z.string(),
  user: CommentUserZod,
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const BlogZod = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.union([z.string(), z.record(z.any())]), // TipTap JSON or HTML string
  status: z.nativeEnum(BlogStatus),
  author: AuthorZod,
  allowComments: z.boolean(),
  comments: z.array(CommentZod).optional(),
  categories: z.array(CategoryZod),
  tags: z.array(TagZod),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
