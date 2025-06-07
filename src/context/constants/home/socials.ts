import axios from "axios";

export interface SocialLink {
  _id: string;
  name: string;
  username: string;
  url: string;
}

export const getSocials = async (): Promise<SocialLink[]> => {
  try {
    const res = await axios.get("/api/v1/admin/socials");
    // API response: { success: true, data: { data: [ ... ], total: n } }
    const data = res.data?.data?.data || [];
    return data.map((social: any) => ({
      _id: social._id,
      name: social.name,
      username: social.username || social.network || "",
      url: social.url,
    }));
  } catch (error) {
    console.error("Failed to fetch socials:", error);
    return [];
  }
};
