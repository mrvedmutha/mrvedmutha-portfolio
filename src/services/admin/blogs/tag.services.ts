import { Tag } from "@/models/admin/blogs/tag.model";
import type { Tag as TagType } from "@/types/admin/blogs/blog.types";
import { dbConnect } from "@/lib/db";

export const tagService = {
  async create(data: Omit<TagType, "id"> & { id: string }): Promise<TagType> {
    await dbConnect();
    // Ensure id is unique
    const exists = await Tag.findOne({ id: data.id });
    if (exists) {
      throw new Error("Tag id must be unique");
    }
    const tag = new Tag(data);
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
