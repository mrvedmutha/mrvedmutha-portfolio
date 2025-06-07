import axios from "axios";
import type {
  ContactMessageRequest,
  ContactMessageResponse,
} from "@/types/admin/pages/contact.types";

export const sendContactMessage = async (payload: ContactMessageRequest) => {
  const res = await axios.post("/api/v1/home/contact", payload);
  return res.data;
};

export const getContactMessages = async (): Promise<
  ContactMessageResponse[]
> => {
  const res = await axios.get("/api/v1/home/contact");
  // Expecting { data: { data: ContactMessageResponse[] } }
  return res.data?.data?.data || [];
};
