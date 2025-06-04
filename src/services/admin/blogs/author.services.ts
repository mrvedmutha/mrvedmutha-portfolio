import { Author } from "@/models/admin/blogs/author.model";
import type { Author as AuthorType } from "@/types/admin/blogs/blog.types";
import { dbConnect } from "@/lib/db";
import { uploadToCloudinary } from "@/services/admin/common/cloudinary.services";

export const authorService = {
  async create(
    data: Omit<AuthorType, "_id"> & { avatarBuffer?: Buffer }
  ): Promise<AuthorType> {
    await dbConnect();
    let avatarUrl = data.avatarUrl;
    if (data.avatarBuffer) {
      // Upload avatar to Cloudinary
      const result = await uploadToCloudinary(data.avatarBuffer, 0);
      avatarUrl = result.secure_url;
    }
    const author = new Author({
      name: data.name,
      email: data.email,
      avatarUrl,
    });
    await author.save();
    return author.toObject();
  },

  async getAll(): Promise<AuthorType[]> {
    await dbConnect();
    const authors = await Author.find({}).lean();
    return authors as unknown as AuthorType[];
  },

  async getById(id: string): Promise<AuthorType | null> {
    await dbConnect();
    const author = await Author.findById(id).lean();
    return author ? (author as unknown as AuthorType) : null;
  },

  async updateById(
    id: string,
    data: Partial<Omit<AuthorType, "_id">> & { avatarBuffer?: Buffer }
  ): Promise<AuthorType | null> {
    await dbConnect();
    const updateData: any = { ...data };
    if (data.avatarBuffer) {
      const result = await uploadToCloudinary(data.avatarBuffer, 0);
      updateData.avatarUrl = result.secure_url;
      delete updateData.avatarBuffer;
    }
    const updated = await Author.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean();
    return updated ? (updated as unknown as AuthorType) : null;
  },

  async deleteById(id: string): Promise<void> {
    await dbConnect();
    await Author.findByIdAndDelete(id);
  },
};
