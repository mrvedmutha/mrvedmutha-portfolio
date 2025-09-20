"use client";
import React from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  sizes?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  objectPosition?: string;
}

// Helper function to optimize Cloudinary URLs
function optimizeCloudinaryUrl(
  src: string,
  width?: number,
  height?: number,
  quality: number = 80
): string {
  // If it's already a Cloudinary URL, optimize it
  if (src.includes('cloudinary.com')) {
    // Extract the base URL and image path
    const parts = src.split('/upload/');
    if (parts.length === 2) {
      const baseUrl = parts[0] + '/upload/';
      const imagePath = parts[1];

      // Build optimization parameters
      const transformations = [];

      // Add quality
      transformations.push(`q_${quality}`);

      // Add format optimization
      transformations.push('f_auto');

      // Add width/height if provided
      if (width) transformations.push(`w_${width}`);
      if (height) transformations.push(`h_${height}`);

      // Add responsive sizing
      transformations.push('c_limit');

      // Add dpr for high-density displays
      transformations.push('dpr_auto');

      return `${baseUrl}${transformations.join(',')}/${imagePath}`;
    }
  }

  // If it's a local image, return as-is
  return src;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 80,
  fill = false,
  sizes,
  objectFit = "cover",
  objectPosition = "center",
  ...props
}: OptimizedImageProps) {
  const optimizedSrc = optimizeCloudinaryUrl(src, width, height, quality);

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || (
    width
      ? `(max-width: 768px) ${Math.min(width, 750)}px, ${width}px`
      : "(max-width: 768px) 100vw, 1200px"
  );

  const imageProps = {
    src: optimizedSrc,
    alt,
    className,
    priority,
    sizes: responsiveSizes,
    style: fill ? undefined : { objectFit, objectPosition },
    ...props,
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        style={{ objectFit, objectPosition }}
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
    />
  );
}