"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import ImageDrawer from "@/components/common/admin/ImageDrawer";
import Image from "next/image";

interface MainImageSelectorProps {
  mainImage: string;
  setMainImage: (v: string) => void;
}

const MainImageSelector: React.FC<MainImageSelectorProps> = ({
  mainImage,
  setMainImage,
}) => {
  console.log("MainImageSelector mainImage:", mainImage);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-4">Main Blog Image</label>
      <div className="aspect-[16/9] w-48 border rounded overflow-hidden mb-2">
        {mainImage ? (
          <Image
            src={mainImage}
            alt="Main"
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
      <ImageDrawer
        value={mainImage}
        onChange={setMainImage}
        trigger={
          <Button variant="outline" className="mt-4">
            {mainImage ? "Change Image" : "Select/Upload Image"}
          </Button>
        }
      />
    </div>
  );
};

export default MainImageSelector;
