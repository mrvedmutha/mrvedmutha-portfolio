"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { SocialIcon } from "react-social-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ISocial } from "@/types/admin/pages/social.types";
import { socialZodSchema } from "@/schemas/zod/admin/pages/social.zod.schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
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
  name: string;
  network: string;
  url: string;
};

export function EditSocialForm({ social }: { social: ISocial }) {
  const [socialOpen, setSocialOpen] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SocialFormValues>({
    resolver: zodResolver(socialZodSchema),
    defaultValues: {
      name: social.name,
      network: social.network,
      url: social.url,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = form;
  const selectedNetwork = watch("network");
  const selectedSocial = SOCIALS.find((s) => s.network === selectedNetwork);

  const onSubmit = async (data: SocialFormValues) => {
    try {
      await axios.patch(`/api/v1/admin/socials/${social._id}`, data);
      toast({
        title: "Social updated",
        description: "Social updated successfully!",
      });
      setTimeout(() => {
        router.push("/admin/pages/socials");
      }, 500);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to update social.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6 max-w-lg mx-auto p-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Social Name Picker */}
        <FormField
          control={control}
          name="network"
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
                    {selectedSocial && (
                      <SocialIcon
                        network={selectedSocial.network}
                        style={{ height: 20, width: 20 }}
                      />
                    )}
                    <span>{selectedSocial?.name || "Select a social"}</span>
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
                                  setValue("network", item.network);
                                  setValue("name", item.name);
                                  setSocialOpen(false);
                                }}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <SocialIcon
                                  network={item.network}
                                  style={{ height: 20, width: 20 }}
                                />
                                <span>{item.name}</span>
                                {selectedNetwork === item.network && (
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
        {/* Url Input */}
        <FormField
          control={control}
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
        <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Update Social"}
        </Button>
      </form>
    </Form>
  );
}

export default EditSocialForm;
