import axios from "axios";

export interface Experience {
  _id: string;
  jobTitle: string;
  companyName: string;
  fromDate: string;
  toDate?: string;
  currentlyWorking: boolean;
  tags: string[];
  aboutCompany?: string;
  responsibilities?: string;
}

export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const res = await axios.get("/api/v1/admin/experience");
    const data = res.data?.data?.data || [];
    return data.map((exp: any) => ({
      _id: exp._id,
      jobTitle: exp.jobTitle,
      companyName: exp.companyName,
      fromDate: exp.fromDate,
      toDate: exp.toDate,
      currentlyWorking: exp.currentlyWorking,
      tags: Array.isArray(exp.tags) ? exp.tags : [],
      aboutCompany: exp.aboutCompany,
      responsibilities: exp.responsibilities,
    }));
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return [];
  }
};
