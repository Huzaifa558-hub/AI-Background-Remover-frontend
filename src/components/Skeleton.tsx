import type { HTMLAttributes } from 'react'

export function Skeleton({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-surface-raised border border-border rounded-md ${className}`}
      aria-hidden="true"
      {...props}
    />
  )
}
