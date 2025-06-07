import axios from "axios";

export interface Blog {
  _id: string;
  title: string;
  mainImage?: string;
  slug: string;
  status: string;
  createdAt: string;
}

export const getBlogs = async (): Promise<Blog[]> => {
  try {
    const res = await axios.get("/api/v1/admin/blogs");
    const data = res.data?.data || [];
    return data
      .filter((blog: any) => blog.status === "published")
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((blog: any) => ({
        _id: blog._id,
        title: blog.title,
        mainImage: blog.mainImage,
        slug: blog.slug,
        status: blog.status,
        createdAt: blog.createdAt,
      }));
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
};
