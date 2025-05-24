"use client";

import DataTable from "@/components/common/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

// Define the Skill type
interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
}

// Column definitions for the skills table
const columns: ColumnDef<Skill>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "proficiency",
    header: "Proficiency",
    cell: (info) => `${info.getValue()}%`,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: (info) => <Button>Edit</Button>,
  },
];

// Mock data for demonstration
const skills: Skill[] = [
  { id: "1", name: "React", category: "Frontend", proficiency: 90 },
  { id: "2", name: "Node.js", category: "Backend", proficiency: 85 },
  { id: "3", name: "TypeScript", category: "Frontend", proficiency: 80 },
  { id: "4", name: "MongoDB", category: "Database", proficiency: 75 },
];

export default function AdminSkillsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Skills</h1>
      <DataTable<Skill> columns={columns} data={skills} model="skill" />
    </div>
  );
}
