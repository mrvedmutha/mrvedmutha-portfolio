import cron from "node-cron";
import { dbConnect } from "@/lib/db";
import { Blog } from "@/models/admin/blogs/blog.model";

export function startBlogScheduler() {
  cron.schedule("*/15 * * * *", async () => {
    await dbConnect();
    const now = new Date();
    const blogs = await Blog.find({
      status: "scheduled",
      scheduledAt: { $lte: now },
    });
    for (const blog of blogs) {
      blog.status = "published";
      await blog.save();
    }
    if (blogs.length) {
      console.log(`Published ${blogs.length} scheduled blogs.`);
    }
  });
  console.log("Blog scheduler started (node-cron).\n");
}
