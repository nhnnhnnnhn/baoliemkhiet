"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc: string
}

export function ImageWithFallback({ src, fallbackSrc, alt, ...props }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)

  // Sử dụng fallbackSrc nếu src là chuỗi rỗng hoặc undefined
  const actualSrc = imgSrc && imgSrc !== "" ? imgSrc : fallbackSrc

  return (
    <Image
      {...props}
      src={actualSrc || "/placeholder.svg"}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
    />
  )
}
