import { z } from "zod";
import { BlogStatus } from "@/enums/admin/blogs/status.enum";

export const AuthorZod = z.object({
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().optional(),
});

export const CategoryZod = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  parentId: z.number().nullable().optional(),
});

export const TagZod = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export const CommentUserZod = z.object({
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().optional(),
});

export const CommentZod = z.object({
  user: CommentUserZod,
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const BlogZod = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: z.nativeEnum(BlogStatus),
  author: z.string().optional(),
  allowComments: z.boolean().optional(),
  comments: z.array(CommentZod).optional(),
  categories: z.array(CategoryZod).optional(),
  tags: z.array(TagZod),
  mainImage: z.string().optional(),
});
