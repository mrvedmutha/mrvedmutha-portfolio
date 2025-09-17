export interface IContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  interestedIn: string;
  budgetRange: string;
  currency: "USD" | "INR";
  country: string;
  message: string;
  createdAt: string;
}

export type ContactMessageRequest = Omit<
  IContactMessage,
  "_id" | "createdAt"
> & { recaptchaToken: string };
export type ContactMessageResponse = IContactMessage;
