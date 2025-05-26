"use client";

import DataTable from "@/components/common/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

// Define the Skill type based on your API
interface Skill {
  _id: string;
  title: string;
  icon: { name: string; lucideName: string };
  tags: { name: string; svg: string }[];
}

// Column definitions for the skills table
const getColumns = (
  router: ReturnType<typeof useRouter>
): ColumnDef<Skill>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: (info) => {
      const tags = info.getValue() as Skill["tags"];
      return (
        <div className="flex flex-wrap gap-1">
          {tags?.map((tag) => (
            <span
              key={tag.name}
              className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs"
            >
              <Image src={tag.svg} alt={tag.name} width={16} height={16} />
              {tag.name}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: (info) => {
      const skill = info.row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(`/admin/pages/skills/edit/${skill._id}`)
              }
            >
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                /* handle delete */
              }}
            >
              <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSkills() {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/admin/skills", {
          credentials: "include",
        });
        const data = await res.json();
        setSkills(data.data || []);
      } catch (err) {
        setSkills([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Skills</h1>
        <Button onClick={() => router.push("/admin/pages/skills/new")}>
          Create New Skill
        </Button>
      </div>
      {loading ? (
        <div className="py-8">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      ) : (
        <DataTable<Skill>
          columns={getColumns(router)}
          data={skills}
          model="skill"
        />
      )}
    </div>
  );
}
