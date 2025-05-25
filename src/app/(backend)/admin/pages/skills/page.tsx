"use client";

import DataTable from "@/components/common/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Define the Skill type based on your API
interface Skill {
  _id: string;
  title: string;
  icon: { name: string; lucideName: string };
  tags: { name: string; svg: string }[];
}

// Column definitions for the skills table
const columns: ColumnDef<Skill>[] = [
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
    cell: (info) => <Button>Edit</Button>,
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
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : skills.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      ) : (
        <DataTable<Skill> columns={columns} data={skills} model="skill" />
      )}
    </div>
  );
}
