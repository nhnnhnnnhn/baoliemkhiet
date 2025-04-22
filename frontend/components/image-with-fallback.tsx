"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc: string
}

export function ImageWithFallback({ src, fallbackSrc, alt, ...rest }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src as string)

  // Handle image load error
  const handleError = () => {
    setImgSrc(fallbackSrc)
  }

  // If src is empty, null, or undefined, use fallback
  const sourceSrc = src ? imgSrc : fallbackSrc

  return <Image {...rest} src={sourceSrc || "/placeholder.svg"} alt={alt} onError={handleError} />
}
