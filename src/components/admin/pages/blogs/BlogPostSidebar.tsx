"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useState } from "react";

export default function BlogPostSidebar() {
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    new Date()
  );
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduledPeriod, setScheduledPeriod] = useState("AM");

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Cancel/Save Buttons */}
      <div className="flex gap-2 mb-4">
        <ShadcnButton variant="outline">Cancel</ShadcnButton>
        <ShadcnButton variant="default">Save</ShadcnButton>
      </div>
      {/* Post Status Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
        {/* If Private: */}
        <div className="mt-2 flex items-center gap-2">
          <Checkbox id="private-password" />
          <label htmlFor="private-password" className="text-sm">
            Password protected
          </label>
        </div>
        {/* If password protected: */}
        <div className="mt-2 flex gap-2">
          <ShadcnInput placeholder="Enter password" />
          <ShadcnButton size="sm">Save</ShadcnButton>
        </div>
        {/* If Scheduled: Popover for calendar and time */}
        <div className="mt-4 w-full flex flex-col gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <ShadcnButton variant="outline" className="w-full justify-start">
                {scheduledDate
                  ? `${scheduledDate.toLocaleDateString()} ${scheduledTime} ${scheduledPeriod}`
                  : "Pick date & time"}
              </ShadcnButton>
            </PopoverTrigger>
            <PopoverContent className="min-w-[320px] w-auto p-4 flex flex-col gap-2">
              <Calendar
                mode="single"
                selected={scheduledDate}
                onSelect={setScheduledDate}
                className="rounded-md border"
              />
              <div className="flex gap-2 items-center">
                <ShadcnInput
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-28"
                />
                <Select
                  value={scheduledPeriod}
                  onValueChange={setScheduledPeriod}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ShadcnButton size="sm">Save</ShadcnButton>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Author Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Author</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select author" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="author1">Author 1</SelectItem>
            <SelectItem value="author2">Author 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Discussion Checkbox */}
      <div className="mb-4 flex items-center gap-2">
        <Checkbox id="allow-comments" />
        <label htmlFor="allow-comments" className="text-sm">
          Allow comments
        </label>
      </div>
      {/* Category Accordion */}
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="category">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              {/* Example parent/child checkboxes */}
              <div>
                <Checkbox id="cat1" />{" "}
                <label htmlFor="cat1">Parent Category 1</label>
                <div className="ml-6">
                  <Checkbox id="cat1-1" />{" "}
                  <label htmlFor="cat1-1">Child 1</label>
                </div>
              </div>
              <div>
                <Checkbox id="cat2" />{" "}
                <label htmlFor="cat2">Parent Category 2</label>
              </div>
              {/* Add Category */}
              <div className="mt-2 flex gap-2">
                <ShadcnButton size="sm">Add Category</ShadcnButton>
              </div>
              {/* Add Category Input/Dropdown */}
              <div className="flex gap-2 mt-2">
                <ShadcnInput placeholder="New category name" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cat1">Parent Category 1</SelectItem>
                    <SelectItem value="cat2">Parent Category 2</SelectItem>
                  </SelectContent>
                </Select>
                <ShadcnButton size="sm">Save</ShadcnButton>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* Tag Accordion */}
      <Accordion type="single" collapsible>
        <AccordionItem value="tag">
          <AccordionTrigger>Tags</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              <Command>
                <CommandInput placeholder="Search or add tag..." />
                <CommandList>
                  <CommandItem>tag1</CommandItem>
                  <CommandItem>tag2</CommandItem>
                  {/* Dynamically render existing tags here */}
                </CommandList>
              </Command>
              <ShadcnButton size="sm">Add Tag</ShadcnButton>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
