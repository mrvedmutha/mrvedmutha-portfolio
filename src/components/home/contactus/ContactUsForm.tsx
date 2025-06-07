"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { sendContactMessage } from "@/context/constants/home/contact";
import { useToast } from "@/hooks/use-toast";
import ReCAPTCHA from "react-google-recaptcha";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(5, "Message is required"),
  recaptchaToken: z.string().min(1, "reCAPTCHA is required"),
});

type ContactFormValues = z.infer<typeof schema>;

export default function ContactUsForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", message: "", recaptchaToken: "" },
  });

  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);

  const onSubmit = async (values: ContactFormValues) => {
    if (!values.recaptchaToken) {
      toast({
        title: "reCAPTCHA required",
        description: "Please verify that you are not a robot.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await sendContactMessage(values);
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
        variant: "default",
      });
      form.reset();
      recaptchaRef.current?.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-6xl p-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Contact Us</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder="Your Name"
                    {...field}
                    className="text-lg py-3"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    className="text-lg py-3"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    placeholder="Your message..."
                    rows={8}
                    {...field}
                    className="text-lg py-3"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recaptchaToken"
              render={({ field }) => (
                <FormItem>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_V2_SITE!}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full text-lg py-4"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
