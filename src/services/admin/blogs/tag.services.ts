import { Tag } from "@/models/admin/blogs/tag.model";
import type { Tag as TagType } from "@/types/admin/blogs/blog.types";
import { dbConnect } from "@/lib/db";
import { slugify } from "@/utils/slug.utils";

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

    // Slug logic: always format slug, or generate from name if empty
    const slug =
      data.slug && data.slug.trim() ? slugify(data.slug) : slugify(data.name);

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
