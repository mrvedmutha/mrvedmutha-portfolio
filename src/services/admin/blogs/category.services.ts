import { Category } from "@/models/admin/blogs/category.model";
import type { Category as CategoryType } from "@/types/admin/blogs/blog.types";
import { dbConnect } from "@/lib/db";

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
    const category = new Category({ ...data, id: nextId });
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
