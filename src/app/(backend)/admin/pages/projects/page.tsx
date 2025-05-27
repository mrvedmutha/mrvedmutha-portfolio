"use client";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { IProject } from "@/types/admin/pages/project.types";
import getColumns from "@/helpers/admin/pages/project.helpers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EProjectType } from "@/enums/admin/pages/EProjectType";
import { Table, TableBody } from "@/components/ui/table";
import { TableSkeletonRows } from "@/components/common/TableSkletonRows";

// Mock techstack
const mockTechstack = [
  {
    name: "React",
    svg: "/assets/devicon-master/icons/react/react-original.svg",
  },
  {
    name: "NextJS",
    svg: "/assets/devicon-master/icons/nextjs/nextjs-original.svg",
  },
];

// Mock data
const mockProjects: IProject[] = [
  {
    _id: "1",
    title: "Portfolio Website",
    description: "A personal portfolio website.",
    type: EProjectType.CODE,
    githubLink: "https://github.com/example/portfolio",
    demoLink: "https://portfolio.example.com",
    techstack: mockTechstack,
  },
  {
    _id: "2",
    title: "Brand Identity Design",
    description: "Branding for a startup.",
    type: EProjectType.GRAPHIC,
    behanceLink: "https://behance.net/example/brand",
    demoLink: "https://brand.example.com",
    techstack: [
      {
        name: "Figma",
        svg: "/assets/devicon-master/icons/figma/figma-original.svg",
      },
      {
        name: "Photoshop",
        svg: "/assets/devicon-master/icons/photoshop/photoshop-original.svg",
      },
    ],
  },
];

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<IProject[]>(mockProjects);
  const [loading, setLoading] = useState(false);

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => router.push("/admin/pages/projects/new")}>
          Create Project
        </Button>
      </div>
      {loading ? (
        <Table>
          <TableBody>
            <TableSkeletonRows columnsCount={5} rowsCount={3} />
          </TableBody>
        </Table>
      ) : projects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      ) : (
        <DataTable<IProject>
          columns={getColumns(router, handleDelete)}
          data={projects}
          model="project"
          fetchUrl="/api/v1/admin/projects"
          page={1}
          pageSize={25}
          total={projects.length}
          onPageChange={() => {}}
        />
      )}
    </div>
  );
}
