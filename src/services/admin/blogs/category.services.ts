import { Category } from "@/models/admin/blogs/category.model";
import type { Category as CategoryType } from "@/types/admin/blogs/blog.types";
import { dbConnect } from "@/lib/db";
import { generateUniqueSlug } from "@/utils/slug.utils";

export const categoryService = {
  async create(
    data: Omit<CategoryType, "id"> // id will be generated
  ): Promise<CategoryType> {
    await dbConnect();
    // Find the max id and increment
    const last = (await Category.findOne({}).sort({ id: -1 }).lean()) as {
      id: number;
    } | null;
    const nextId = last && typeof last.id === "number" ? last.id + 1 : 1;
    // Generate slug if not provided or empty
    const slug = await generateUniqueSlug(data.name, Category, data.slug);
    const category = new Category({ ...data, id: nextId, slug });
    await category.save();
    return category.toObject();
  },

  async getAll(): Promise<CategoryType[]> {
    await dbConnect();
    const categories = await Category.find({}).lean();
    return categories as unknown as CategoryType[];
  },

  async getById(id: string): Promise<CategoryType | null> {
    await dbConnect();
    const category = await Category.findOne({ id }).lean();
    return category ? (category as unknown as CategoryType) : null;
  },

  async updateById(
    id: string,
    data: Partial<Omit<CategoryType, "id">>
  ): Promise<CategoryType | null> {
    await dbConnect();
    // If name or slug is being updated, regenerate slug
    if (data.name || data.slug === "") {
      const existing = await Category.findOne({ id });
      if (existing) {
        data.slug = await generateUniqueSlug(
          data.name || existing.name,
          Category,
          data.slug
        );
      }
    }
    const updated = await Category.findOneAndUpdate({ id }, data, {
      new: true,
    }).lean();
    return updated ? (updated as unknown as CategoryType) : null;
  },

  async deleteById(id: string): Promise<void> {
    await dbConnect();
    await Category.findOneAndDelete({ id });
  },
};
