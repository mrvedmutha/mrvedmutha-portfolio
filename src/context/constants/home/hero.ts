import axios from "axios";

// Fetch data from API route /api/v1/admin/skills/custom/skills-title
export const getHeroSkills = async (): Promise<string[]> => {
  try {
    const res = await axios.get("/api/v1/admin/skills/custom/skills-title");
    // The API returns { data: [...] }
    return Array.isArray(res.data.data) ? res.data.data : [];
  } catch (error) {
    console.error("Failed to fetch hero skills:", error);
    return [];
  }
};

//get data from api route /api/v1/admin/skills/custom/tags/icon
export const getTechStackLogos = async (): Promise<string[]> => {
  try {
    const res = await axios.get("/api/v1/admin/skills/custom/tags/icons");
    return Array.isArray(res.data.data) ? res.data.data : [];
  } catch (error) {
    console.error("Failed to fetch tech stack logos:", error);
    return [];
  }
};
