import mongoose from "mongoose";
import ContactMessageSchema, {
  IContactMessageDoc,
} from "@/schemas/admin/pages/contact.schema";

const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessageDoc>("ContactMessage", ContactMessageSchema);

export default ContactMessage;
