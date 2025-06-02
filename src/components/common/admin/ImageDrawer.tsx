import React, { useState, useEffect, useRef } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

export default function ImageDrawer({
  value,
  onChange,
  trigger,
}: {
  value: string;
  onChange: (url: string) => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("gallery");
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    if (open && tab === "gallery") {
      setLoadingImages(true);
      axios
        .get("/api/v1/admin/media")
        .then((res) => setImages(res.data.data))
        .finally(() => setLoadingImages(false));
    }
  }, [open, tab]);

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append("file", uploadFile);
    const res = await axios.post("/api/v1/admin/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) =>
        setProgress(Math.round((e.loaded * 100) / (e.total || 1))),
    });
    setUploading(false);
    setUploadFile(null);
    setUploadPreview(null);
    setTab("gallery");
    setImages([res.data.data, ...images]);
    onChange(res.data.data.url);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select or Upload Main Image</DrawerTitle>
        </DrawerHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex gap-2 mb-4">
            <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>
          <TabsContent value="gallery">
            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              {loadingImages
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="aspect-[16/9] w-full h-48 rounded"
                    />
                  ))
                : images.map((img: any) => (
                    <div
                      key={img.asset_id || img.public_id}
                      className={`aspect-[16/9] border rounded cursor-pointer p-1 flex items-center justify-center relative ${
                        value === img.secure_url ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => {
                        onChange(img.secure_url);
                        setOpen(false);
                      }}
                    >
                      <img
                        src={img.secure_url}
                        alt=""
                        className="object-cover w-full h-full rounded"
                      />
                    </div>
                  ))}
            </div>
          </TabsContent>
          <TabsContent value="upload">
            <div className="my-2 flex flex-col items-center relative w-full">
              {!uploadPreview ? (
                <label
                  htmlFor="blog-image-upload"
                  className={`w-full h-48 border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer transition ${
                    dragActive
                      ? "border-primary bg-primary/10"
                      : "border-muted-foreground"
                  } hover:border-primary`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      setUploadFile(file);
                      setUploadPreview(URL.createObjectURL(file));
                    }
                  }}
                  onClick={() => inputRef.current?.click()}
                >
                  <span className="text-muted-foreground text-sm">
                    Drag image here or{" "}
                    <span className="underline">click to upload</span>
                  </span>
                  <input
                    ref={inputRef}
                    id="blog-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadFile(file);
                        setUploadPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="relative w-full h-48 border rounded overflow-hidden mb-2 flex items-center justify-center">
                  <img
                    src={uploadPreview}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                  {uploading && (
                    <div className="absolute inset-0 flex items-end">
                      <Progress value={progress} className="w-full h-2" />
                    </div>
                  )}
                </div>
              )}
              {uploadPreview && (
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-2"
                  size="sm"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
