"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { SocialIcon } from "react-social-icons";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const SOCIALS = [
  { name: "LinkedIn", network: "linkedin" },
  { name: "GitHub", network: "github" },
  { name: "Twitter", network: "twitter" },
  { name: "Facebook", network: "facebook" },
  { name: "Instagram", network: "instagram" },
  { name: "YouTube", network: "youtube" },
  { name: "Dribbble", network: "dribbble" },
  { name: "Behance", network: "behance" },
  { name: "Medium", network: "medium" },
  { name: "Reddit", network: "reddit" },
];

type SocialFormValues = {
  social: (typeof SOCIALS)[0] | null;
  url: string;
};

export default function NewSocialForm({
  onSubmit,
}: {
  onSubmit?: (data: any) => void;
}) {
  const [socialOpen, setSocialOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<SocialFormValues>({
    defaultValues: {
      social: null,
      url: "",
    },
  });

  const handleSubmit = async (values: SocialFormValues) => {
    if (values.social && values.url) {
      setLoading(true);
      try {
        const payload = {
          name: values.social.name,
          network: values.social.network,
          url: values.url,
        };
        const res = await axios.post("/api/v1/admin/socials/create", payload, {
          withCredentials: true,
        });
        if (res.status === 201) {
          toast({
            title: "Social created",
            description: "Social created successfully!",
          });
          setTimeout(() => {
            router.push("/admin/pages/socials");
          }, 500);
          onSubmit?.(res.data);
          form.reset();
        } else {
          toast({
            title: "Error",
            description: "Failed to create social.",
            variant: "destructive",
          });
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description:
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            "Failed to create social.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="social"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 w-full justify-start"
                    onClick={() => setSocialOpen((open) => !open)}
                    aria-expanded={socialOpen}
                  >
                    {field.value && (
                      <SocialIcon
                        network={field.value.network}
                        style={{ height: 20, width: 20 }}
                      />
                    )}
                    <span>{field.value?.name || "Select a social"}</span>
                  </Button>
                  {socialOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-popover border rounded shadow-lg">
                      <Command>
                        <CommandInput placeholder="Search social..." />
                        <CommandList>
                          <CommandEmpty>No socials found.</CommandEmpty>
                          <CommandGroup heading="Socials">
                            {SOCIALS.map((item) => (
                              <CommandItem
                                key={item.name}
                                onSelect={() => {
                                  field.onChange(item);
                                  setSocialOpen(false);
                                }}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <SocialIcon
                                  network={item.network}
                                  style={{ height: 20, width: 20 }}
                                />
                                <span>{item.name}</span>
                                {field.value?.name === item.name && (
                                  <span className="ml-auto text-primary">
                                    ✓
                                  </span>
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Enter the full URL"
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={!form.watch("social") || !form.watch("url") || loading}
        >
          {loading ? "Creating..." : "Create Social"}
        </Button>
      </form>
    </Form>
  );
}
