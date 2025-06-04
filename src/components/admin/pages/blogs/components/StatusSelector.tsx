"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BlogStatus } from "@/enums/admin/blogs/status.enum";

interface StatusSelectorProps {
  status: BlogStatus;
  setStatus: (v: BlogStatus) => void;
  allowComments: boolean;
  setAllowComments: (v: boolean) => void;
  isPasswordProtected: boolean;
  setIsPasswordProtected: (v: boolean) => void;
  password: string;
  setPassword: (v: string) => void;
  scheduledDate: Date | undefined;
  setScheduledDate: (v: Date | undefined) => void;
  scheduledHour: string;
  setScheduledHour: (v: string) => void;
  scheduledMinute: string;
  setScheduledMinute: (v: string) => void;
  scheduledPeriod: string;
  setScheduledPeriod: (v: string) => void;
  popoverOpen: boolean;
  setPopoverOpen: (v: boolean) => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  status,
  setStatus,
  allowComments,
  setAllowComments,
  isPasswordProtected,
  setIsPasswordProtected,
  password,
  setPassword,
  scheduledDate,
  setScheduledDate,
  scheduledHour,
  setScheduledHour,
  scheduledMinute,
  setScheduledMinute,
  scheduledPeriod,
  setScheduledPeriod,
  popoverOpen,
  setPopoverOpen,
}) => (
  <>
    {/* Post Status Dropdown */}
    <div className="mb-8">
      <label className="block text-sm font-medium mb-2">Status</label>
      <Select value={status} onValueChange={(v) => setStatus(v as BlogStatus)}>
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(BlogStatus).map((s) => (
            <SelectItem key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* If Private: Password */}
      {status === BlogStatus.PRIVATE && (
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="private-password"
              checked={isPasswordProtected}
              onCheckedChange={(checked) =>
                setIsPasswordProtected(checked === true)
              }
            />
            <label htmlFor="private-password" className="text-sm">
              Password protected
            </label>
          </div>
          {isPasswordProtected && (
            <div className="flex gap-2">
              <Input
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
        </div>
      )}
      {/* If Scheduled: Popover for calendar and time */}
      {status === BlogStatus.SCHEDULED && (
        <div className="mt-6 w-full flex flex-col gap-4">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {scheduledDate
                  ? `${scheduledDate.toLocaleDateString()} ${scheduledHour}:${scheduledMinute} ${scheduledPeriod}`
                  : "Pick date & time"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[320px] w-auto p-4 flex flex-col gap-4">
              <Calendar
                mode="single"
                selected={scheduledDate}
                onSelect={setScheduledDate}
                className="rounded-md border"
              />
              <div className="flex justify-center gap-4 items-center w-full">
                <Input
                  type="number"
                  min="1"
                  max="12"
                  placeholder="hh"
                  value={scheduledHour}
                  onChange={(e) =>
                    setScheduledHour(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-16 text-center"
                  maxLength={2}
                />
                <span className="text-lg font-semibold">:</span>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="mm"
                  value={scheduledMinute}
                  onChange={(e) =>
                    setScheduledMinute(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-16 text-center"
                  maxLength={2}
                />
                <select
                  value={scheduledPeriod}
                  onChange={(e) => setScheduledPeriod(e.target.value)}
                  className="border rounded px-2 py-1 text-sm focus:outline-none"
                >
                  <option value="">Select</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              <Button size="sm" onClick={() => setPopoverOpen(false)}>
                Save
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
    {/* Discussion Checkbox */}
    <div className="mb-4 flex items-center gap-2">
      <Checkbox
        id="allow-comments"
        checked={allowComments}
        onCheckedChange={(checked) => setAllowComments(checked === true)}
      />
      <label htmlFor="allow-comments" className="text-sm">
        Allow comments
      </label>
    </div>
  </>
);

export default StatusSelector;
