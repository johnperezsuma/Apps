"use client";

import Image from "next/image";

interface QRImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function QRImage({ src, alt, width = 300, height = 300, className }: QRImageProps) {
  // Si es una data URL, usar img normal
  if (src.startsWith("data:")) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  // Si es una URL normal, usar Next.js Image
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}

