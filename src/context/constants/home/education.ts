import axios from "axios";

export interface Education {
  _id: string;
  educationName: string;
  instituteName: string;
  educationType: string;
  description?: string;
  fromYear: string;
  toYear: string;
  tags: string[];
}

export const getEducations = async (): Promise<Education[]> => {
  try {
    const res = await axios.get("/api/v1/admin/education");
    const data = res.data?.data?.data || [];
    return data
      .map((edu: any) => ({
        _id: edu._id,
        educationName: edu.educationName,
        instituteName: edu.instituteName,
        educationType: edu.educationType,
        description: edu.description,
        fromYear: edu.fromYear,
        toYear: edu.toYear,
        tags: Array.isArray(edu.tags) ? edu.tags : [],
      }))
      .sort(
        (a: Education, b: Education) => Number(b.fromYear) - Number(a.fromYear)
      );
  } catch (error) {
    console.error("Failed to fetch educations:", error);
    return [];
  }
};
