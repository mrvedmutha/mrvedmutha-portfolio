"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  sectionsSchema,
  SectionsFormValues,
} from "@/schemas/zod/admin/pages/sections.zod.schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const defaultValues: SectionsFormValues = {
  name: "",
  currentCity: "",
  country: "",
  degree: "",
  dob: "",
  about: "",
};

export default function SectionsShow() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState("Save");

  const form = useForm<SectionsFormValues>({
    resolver: zodResolver(sectionsSchema),
    defaultValues,
  });

  useEffect(() => {
    async function fetchSection() {
      setLoading(true);
      try {
        const res = await axios.get("/api/v1/admin/sections");
        const data = res.data?.data?.data?.[0];
        if (data) {
          setSectionId(data._id);
          setButtonText("Update");
          form.reset({
            name: data.name || "",
            currentCity: data.currentCity || "",
            country: data.country || "",
            degree: data.degree || "",
            dob: data.dob || "",
            about: data.about || "",
          });
        } else {
          setSectionId(null);
          setButtonText("Save");
          form.reset(defaultValues);
        }
      } catch (error: any) {
        setSectionId(null);
        setButtonText("Save");
        form.reset(defaultValues);
      } finally {
        setLoading(false);
      }
    }
    fetchSection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: SectionsFormValues) {
    setSubmitting(true);
    try {
      let res;
      if (sectionId) {
        res = await axios.put(`/api/v1/admin/sections?id=${sectionId}`, values);
      } else {
        res = await axios.post("/api/v1/admin/sections", values);
      }
      const data = res.data?.data;
      setButtonText("Update");
      if (data && data._id) setSectionId(data._id);
      toast({
        title: sectionId ? "Section updated!" : "Section created!",
        description: sectionId
          ? "Your section has been updated."
          : "Your section has been created.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.error || error.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="w-full max-w-xl flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">
          {buttonText === "Update" ? "Edit Section" : "Create Section"}
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full p-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      disabled={loading || submitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your current city"
                      {...field}
                      disabled={loading || submitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your country"
                      {...field}
                      disabled={loading || submitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your degree"
                      {...field}
                      disabled={loading || submitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      disabled={loading || submitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Me</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself"
                      {...field}
                      disabled={loading || submitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full mt-4"
              disabled={loading || submitting}
            >
              {loading
                ? "Loading..."
                : submitting
                ? buttonText === "Save"
                  ? "Saving..."
                  : "Updating..."
                : buttonText}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
