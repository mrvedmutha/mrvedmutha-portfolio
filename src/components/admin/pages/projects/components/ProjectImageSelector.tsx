"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import ProjectImageDrawer from "@/components/common/admin/ProjectImageDrawer";
import Image from "next/image";

interface ProjectImageSelectorProps {
  projectImage: string;
  setProjectImage: (v: string) => void;
}

const ProjectImageSelector: React.FC<ProjectImageSelectorProps> = ({
  projectImage,
  setProjectImage,
}) => {
  console.log("ProjectImageSelector projectImage:", projectImage);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-4">Project Image</label>
      <div className="aspect-[16/9] w-48 border rounded overflow-hidden mb-2">
        {projectImage ? (
          <Image
            src={projectImage}
            alt="Project"
            className="object-cover w-full h-full"
            width={320}
            height={180}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <ProjectImageDrawer
        value={projectImage}
        onChange={setProjectImage}
        trigger={
          <Button variant="outline" className="mt-4">
            {projectImage ? "Change Image" : "Select/Upload Image"}
          </Button>
        }
      />
    </div>
  );
};

export default ProjectImageSelector;