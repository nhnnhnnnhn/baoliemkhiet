"use client"

import type React from "react"

import Link from "next/link"
import { forwardRef } from "react"

interface SafeLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  href: string
  children: React.ReactNode
}

export const SafeLink = forwardRef<HTMLAnchorElement, SafeLinkProps>(({ href, children, ...props }, ref) => {
  // If href is empty, null, or undefined, render a span instead
  if (!href) {
    return <span {...props}>{children}</span>
  }

  return (
    <Link href={href} {...props} ref={ref}>
      {children}
    </Link>
  )
})

SafeLink.displayName = "SafeLink"
