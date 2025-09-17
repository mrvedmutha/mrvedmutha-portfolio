import ContactMessage from "@/models/admin/pages/contact.model";
import type {
  ContactMessageRequest,
  ContactMessageResponse,
} from "@/types/admin/pages/contact.types";
import { dbConnect } from "@/lib/db";

export const contactusService = {
  async create(
    data: Omit<ContactMessageRequest, "recaptchaToken"> | ContactMessageRequest
  ): Promise<ContactMessageResponse> {
    await dbConnect();
    // Save all fields (ignore recaptchaToken if present)
    const { name, email, phone, interestedIn, budgetRange, currency, country, message } = data;
    const saved = await ContactMessage.create({ name, email, phone, interestedIn, budgetRange, currency, country, message });
    return saved.toObject();
  },

  async getAll(): Promise<ContactMessageResponse[]> {
    await dbConnect();
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    return messages.map((msg: any) => ({
      _id: msg._id.toString(),
      name: msg.name,
      email: msg.email,
      phone: msg.phone,
      interestedIn: msg.interestedIn,
      budgetRange: msg.budgetRange,
      currency: msg.currency,
      country: msg.country,
      message: msg.message,
      createdAt:
        msg.createdAt instanceof Date
          ? msg.createdAt.toISOString()
          : msg.createdAt,
    }));
  },

  async getById(id: string): Promise<ContactMessageResponse | null> {
    await dbConnect();
    const msg = await ContactMessage.findById(id).lean();
    if (!msg) return null;
    const m = msg as any;
    return {
      _id: m._id.toString(),
      name: m.name,
      email: m.email,
      phone: m.phone,
      interestedIn: m.interestedIn,
      budgetRange: m.budgetRange,
      currency: m.currency,
      country: m.country,
      message: m.message,
      createdAt:
        m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
    };
  },

  async deleteById(id: string): Promise<{ success: boolean }> {
    await dbConnect();
    await ContactMessage.findByIdAndDelete(id);
    return { success: true };
  },
};
