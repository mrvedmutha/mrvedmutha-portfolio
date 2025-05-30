import { Blog } from "@/models/admin/blogs/blog.model";
import { BlogZod } from "@/schemas/zod/admin/blogs/blog.zod";
import type { Blog as BlogType } from "@/types/admin/blogs/blog.types";
import { dbConnect } from "@/lib/db";

export const blogService = {
  async create(
    data: Omit<BlogType, "_id" | "createdAt" | "updatedAt">
  ): Promise<BlogType> {
    await dbConnect();
    // Validate input
    const parsed = BlogZod.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
    }
    // Save to DB
    const blog = new Blog(parsed.data);
    await blog.save();
    return blog.toObject();
  },

  async getAll(limit = 25, skip = 0): Promise<BlogType[]> {
    await dbConnect();
    const blogs = await Blog.find({}).skip(skip).limit(limit).lean();
    return blogs as unknown as BlogType[];
  },

  async getById(id: string): Promise<BlogType | null> {
    await dbConnect();
    const blog = await Blog.findById(id).lean();
    return blog ? (blog as unknown as BlogType) : null;
  },

  async updateById(
    id: string,
    data: Partial<Omit<BlogType, "_id" | "createdAt" | "updatedAt">>
  ): Promise<BlogType | null> {
    await dbConnect();
    const parsed = BlogZod.partial().safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
    }
    const updated = await Blog.findByIdAndUpdate(id, parsed.data, {
      new: true,
    }).lean();
    return updated ? (updated as unknown as BlogType) : null;
  },

  async deleteById(id: string): Promise<void> {
    await dbConnect();
    await Blog.findByIdAndDelete(id);
  },
};
