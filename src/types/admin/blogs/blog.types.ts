import { BlogStatus } from "@/enums/admin/blogs/status.enum";

export interface Author {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Category {
  id: number; // custom id, not Mongo _id
  name: string;
  description?: string;
  slug: string;
  parentId?: number | null; // parent category id
}

export interface Tag {
  id: number; // custom id, not Mongo _id
  name: string;
  slug: string;
}

export interface CommentUser {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Comment {
  _id: string;
  user: CommentUser;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string | object; // TipTap JSON or HTML string
  status: BlogStatus;
  author?: string;
  allowComments?: boolean;
  comments?: Comment[];
  categories?: Category[];
  tags?: Tag[];
  mainImage?: string;
}
