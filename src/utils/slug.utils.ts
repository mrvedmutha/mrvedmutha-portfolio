export async function generateUniqueSlug(
  text: string,
  model: any,
  providedSlug?: string
): Promise<string> {
  // Use provided slug or generate from text
  let baseSlug = providedSlug && providedSlug.trim() ? providedSlug : text;
  baseSlug = baseSlug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  let slug = baseSlug;
  let counter = 1;
  let exists = await model.findOne({ slug });
  while (exists) {
    slug = `${baseSlug}-${counter}`;
    exists = await model.findOne({ slug });
    counter++;
  }
  return slug;
}
