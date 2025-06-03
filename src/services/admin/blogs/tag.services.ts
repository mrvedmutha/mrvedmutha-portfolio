import { Tag } from "@/models/admin/blogs/tag.model";
import type { Tag as TagType } from "@/types/admin/blogs/blog.types";
import { dbConnect } from "@/lib/db";
import { generateUniqueSlug } from "@/utils/slug.utils";

export const tagService = {
  async create(
    data: Omit<TagType, "id"> // id will be generated
  ): Promise<TagType> {
    await dbConnect();
    // Find the max id and increment
    const last = (await Tag.findOne({}).sort({ id: -1 }).lean()) as {
      id: number;
    } | null;
    const nextId = last && typeof last.id === "number" ? last.id + 1 : 1;
    // Generate slug if not provided or empty
    const slug = await generateUniqueSlug(data.name, Tag, data.slug);
    const tag = new Tag({ ...data, id: nextId, slug });
    await tag.save();
    return tag.toObject();
  },

  async getAll(): Promise<TagType[]> {
    await dbConnect();
    const tags = await Tag.find({}).lean();
    return tags as unknown as TagType[];
  },

  async getById(id: string): Promise<TagType | null> {
    await dbConnect();
    const tag = await Tag.findOne({ id }).lean();
    return tag ? (tag as unknown as TagType) : null;
  },

  async updateById(
    id: string,
    data: Partial<Omit<TagType, "id">>
  ): Promise<TagType | null> {
    await dbConnect();
    // If name or slug is being updated, regenerate slug
    if (data.name || data.slug === "") {
      const existing = await Tag.findOne({ id });
      if (existing) {
        data.slug = await generateUniqueSlug(
          data.name || existing.name,
          Tag,
          data.slug
        );
      }
    }
    const updated = await Tag.findOneAndUpdate({ id }, data, {
      new: true,
    }).lean();
    return updated ? (updated as unknown as TagType) : null;
  },

  async deleteById(id: string): Promise<void> {
    await dbConnect();
    await Tag.findOneAndDelete({ id });
  },
};
