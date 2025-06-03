import axios from "axios";

export function addTag(
  tag: string,
  selectedTags: string[],
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
) {
  if (tag && !selectedTags.includes(tag)) {
    setSelectedTags([...selectedTags, tag]);
  }
}

export function removeTag(
  tag: string,
  selectedTags: string[],
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
) {
  setSelectedTags(selectedTags.filter((t) => t !== tag));
}

interface HandleAddTagArgs {
  tagInput: string;
  setAddTagLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTagInput: React.Dispatch<React.SetStateAction<string>>;
  fetchTags: () => void;
}

export async function handleAddTag({
  tagInput,
  setAddTagLoading,
  setTagInput,
  fetchTags,
}: HandleAddTagArgs) {
  if (!tagInput) return;
  setAddTagLoading(true);
  try {
    await axios.post("/api/v1/admin/blogs/tags/create", { name: tagInput });
    setTagInput("");
    fetchTags();
  } catch (e) {
    // Optionally show error toast
  } finally {
    setAddTagLoading(false);
  }
}
