export interface IContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export type ContactMessageRequest = Omit<
  IContactMessage,
  "_id" | "createdAt"
> & { recaptchaToken: string };
export type ContactMessageResponse = IContactMessage;
