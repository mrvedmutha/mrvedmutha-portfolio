import { z } from "zod";
import { BlogStatus } from "@/enums/admin/blogs/status.enum";
import {
  Blog,
  Author,
  Category,
  Tag,
  Comment,
  CommentUser,
} from "@/types/admin/blogs/blog.types";

export const AuthorZod: z.ZodType<Author> = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().optional(),
});

export const CategoryZod: z.ZodType<Category> = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  parentId: z.number().nullable().optional(),
});

export const TagZod: z.ZodType<Tag> = z.object({
  id: z.number(),
  name: z.string(),
});

export const CommentUserZod: z.ZodType<CommentUser> = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().optional(),
});

export const CommentZod: z.ZodType<Comment> = z.object({
  _id: z.string(),
  user: CommentUserZod,
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const BlogZod: z.ZodType<Blog> = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: z.nativeEnum(BlogStatus),
  author: AuthorZod.optional(),
  allowComments: z.boolean().optional(),
  comments: z.array(CommentZod).optional(),
  categories: z.array(CategoryZod).optional(),
  tags: z.array(TagZod),
  mainImage: z.string().optional(),
});
