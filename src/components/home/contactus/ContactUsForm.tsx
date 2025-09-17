"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown, Phone, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendContactMessage } from "@/context/constants/home/contact";
import { useToast } from "@/hooks/use-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { contactZodSchema, ContactMessageZodType } from "@/schemas/zod/admin/pages/contact.zod.schema";
import PrimaryButton from "@/components/home/ui/buttons/PrimaryButton";

// Countries list
const countries = [
  { value: "US", label: "United States" },
  { value: "IN", label: "India" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "JP", label: "Japan" },
  { value: "BR", label: "Brazil" },
  { value: "CN", label: "China" },
  { value: "RU", label: "Russia" },
  { value: "MX", label: "Mexico" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
  { value: "NL", label: "Netherlands" },
  { value: "SG", label: "Singapore" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "CH", label: "Switzerland" },
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
];

// Budget ranges based on currency
const budgetRanges = {
  USD: [
    { value: "$500-$2,000", label: "$500 - $2,000" },
    { value: "$2,000-$5,000", label: "$2,000 - $5,000" },
    { value: "$5,000-$10,000", label: "$5,000 - $10,000" },
    { value: "$10,000-$25,000", label: "$10,000 - $25,000" },
    { value: "$25,000+", label: "$25,000+" },
  ],
  INR: [
    { value: "₹2,500-₹5,000", label: "₹2,500 - ₹5,000" },
    { value: "₹5,000-₹10,000", label: "₹5,000 - ₹10,000" },
    { value: "₹10,000-₹15,000", label: "₹10,000 - ₹15,000" },
    { value: "₹15,000-₹20,000", label: "₹15,000 - ₹20,000" },
    { value: "₹20,000-₹25,000", label: "₹20,000 - ₹25,000" },
    { value: "₹25,000-₹30,000", label: "₹25,000 - ₹30,000" },
    { value: "₹30,000-₹35,000", label: "₹30,000 - ₹35,000" },
    { value: "₹35,000-₹40,000", label: "₹35,000 - ₹40,000" },
    { value: "₹40,000-₹45,000", label: "₹40,000 - ₹45,000" },
    { value: "₹45,000-₹50,000", label: "₹45,000 - ₹50,000" },
    { value: "₹50,000+", label: "₹50,000+" },
  ]
};

export default function ContactUsForm() {
  const form = useForm<ContactMessageZodType>({
    resolver: zodResolver(contactZodSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interestedIn: "",
      budgetRange: "",
      currency: "INR",
      country: "",
      message: "",
      recaptchaToken: ""
    },
  });

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Array<{value: string, label: string}>>([]);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);

  // Watch currency changes to reset budget range
  const currency = form.watch("currency");

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/v1/admin/services');
        const data = await response.json();
        if (data.success && data.data.data) {
          const serviceOptions = data.data.data.map((service: any) => ({
            value: service.title,
            label: service.title
          }));
          serviceOptions.push({ value: "Other", label: "Other" });
          setServices(serviceOptions);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setServices([{ value: "Other", label: "Other" }]);
      }
    };
    fetchServices();
  }, []);

  const onSubmit = async (values: ContactMessageZodType) => {
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
        description: "Thank you for reaching out. We&apos;ll get back to you soon.",
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
    <div className="w-full mx-auto">
      <div className="p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
          {/* Left Side - Content */}
          <div className="lg:w-1/2">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-0.5 bg-brand-yellow"></div>
                <span className="text-white font-medium">Services</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Let&apos;s Talk for <span className="text-brand-yellow italic">Your</span>
                <br />
                <span className="text-brand-yellow italic">Next Projects</span>
              </h2>
              <p className="text-white/80 max-w-md">
                Please fill out the form, and I&apos;ll get back to you at my earliest availability. I look forward to working with you!
              </p>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-brand-green" />
                </div>
                <span>+91-9941864844</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-brand-green" />
                </div>
                <span>coolshreyan501@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-1/2">

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Your Name *</FormLabel>
                        <Input
                          placeholder="Ex: John Doe"
                          {...field}
                          className="bg-transparent border-white/30 text-white placeholder:text-white/60 focus:border-brand-yellow focus:ring-brand-yellow"
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
                        <FormLabel className="text-white">Email *</FormLabel>
                        <Input
                          type="email"
                          placeholder="example@gmail.com"
                          {...field}
                          className="bg-transparent border-white/30 text-white placeholder:text-white/60 focus:border-brand-yellow focus:ring-brand-yellow"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone and Interested In Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Phone *</FormLabel>
                        <Input
                          placeholder="Enter Phone Number"
                          {...field}
                          className="bg-transparent border-white/30 text-white placeholder:text-white/60 focus:border-brand-yellow focus:ring-brand-yellow"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interestedIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">I&apos;m Interested In *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="bg-transparent border-white/30 text-white focus:border-brand-yellow focus:ring-brand-yellow">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service.value} value={service.value}>
                                {service.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Budget and Currency Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="budgetRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Budget Range *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="bg-transparent border-white/30 text-white focus:border-brand-yellow focus:ring-brand-yellow">
                            <SelectValue placeholder="Enter Range" />
                          </SelectTrigger>
                          <SelectContent>
                            {budgetRanges[currency as "USD" | "INR"].map((budget) => (
                              <SelectItem key={budget.value} value={budget.value}>
                                {budget.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Currency *</FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          // Reset budget range when currency changes
                          form.setValue("budgetRange", "");
                        }} value={field.value}>
                          <SelectTrigger className="bg-transparent border-white/30 text-white focus:border-brand-yellow focus:ring-brand-yellow">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">INR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Select Country *</FormLabel>
                      <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={countryOpen}
                            className="w-full justify-between bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white focus:border-brand-yellow focus:ring-brand-yellow"
                          >
                            {field.value
                              ? countries.find((country) => country.label.toLowerCase().includes(field.value.toLowerCase()) || country.value === field.value)?.label
                              : "Select"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search country..." />
                            <CommandGroup>
                              <CommandList>
                                {countries.map((country) => (
                                  <CommandItem
                                    key={country.value}
                                    value={country.label}
                                    onSelect={() => {
                                      field.onChange(country.label);
                                      setCountryOpen(false);
                                    }}
                                    keywords={[country.label, country.value]}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === country.label ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {country.label}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Your Message *</FormLabel>
                      <Textarea
                        placeholder="Enter here..."
                        rows={4}
                        {...field}
                        className="bg-transparent border-white/30 text-white placeholder:text-white/60 focus:border-brand-yellow focus:ring-brand-yellow resize-none"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* reCAPTCHA */}
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

                {/* Submit Button */}
                <PrimaryButton
                  type="submit"
                  disabled={loading}
                  size="md"
                  variant="reversed"
                >
                  {loading ? "Sending..." : "Submit"}
                </PrimaryButton>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
