import { Category } from "@/models/admin/blogs/category.model";
import type { Category as CategoryType } from "@/types/admin/blogs/blog.types";
import { dbConnect } from "@/lib/db";
import { slugify } from "@/utils/slug.utils";

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

    // Slug logic
    let slug =
      data.slug && data.slug.trim() ? slugify(data.slug) : slugify(data.name);
    let exists = await Category.findOne({ slug });
    if (exists) {
      // If parentId is present, try parentname-slug
      if (data.parentId) {
        const parent = await Category.findOne({ id: data.parentId });
        if (parent && parent.name) {
          const parentSlug = slugify(parent.name);
          slug = `${parentSlug}-${slug}`;
        }
      } else {
        // No parent, so try slug-1, slug-2, etc.
        let counter = 1;
        let newSlug = `${slug}-${counter}`;
        let existsNew = await Category.findOne({ slug: newSlug });
        while (existsNew) {
          counter++;
          newSlug = `${slug}-${counter}`;
          existsNew = await Category.findOne({ slug: newSlug });
        }
        slug = newSlug;
      }
    }

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
