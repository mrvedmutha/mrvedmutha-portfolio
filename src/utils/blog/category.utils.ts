import axios from "axios";

interface HandleAddCategoryArgs {
  newCategoryName: string;
  setAddCategoryLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setNewCategoryName: React.Dispatch<React.SetStateAction<string>>;
  setParentCategoryId: React.Dispatch<React.SetStateAction<string>>;
  setShowAddCategory: React.Dispatch<React.SetStateAction<boolean>>;
  parentCategoryId: string;
  fetchCategories: () => void;
}

export async function handleAddCategory({
  newCategoryName,
  setAddCategoryLoading,
  setNewCategoryName,
  setParentCategoryId,
  setShowAddCategory,
  parentCategoryId,
  fetchCategories,
}: HandleAddCategoryArgs) {
  if (!newCategoryName) return;
  setAddCategoryLoading(true);
  try {
    await axios.post("/api/v1/admin/blogs/category/create", {
      name: newCategoryName,
      parentId: parentCategoryId || null,
    });
    setNewCategoryName("");
    setParentCategoryId("");
    setShowAddCategory(false);
    fetchCategories();
  } catch (e) {
    // Optionally show error toast
  } finally {
    setAddCategoryLoading(false);
  }
}

export function getAncestorIds(
  categoryId: number,
  categories: any[]
): number[] {
  const map: Record<number, any> = {};
  categories.forEach((cat) => {
    map[cat.id] = cat;
  });
  const ancestors: number[] = [];
  let current = map[categoryId];
  while (current && current.parentId !== null && map[current.parentId]) {
    ancestors.push(current.parentId);
    current = map[current.parentId];
  }
  return ancestors;
}
