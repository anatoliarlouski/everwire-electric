"use client"

import Image from "next/image"
import { Images } from "lucide-react"
import type { Project } from "@/lib/data/projects"
import { createBlurPlaceholder } from "@/lib/utils/image"

interface ProjectCardProps {
  project: Project
  /** Larger type and taller image for a featured slot */
  featured?: boolean
  /** Makes the card an interactive button (used by the gallery lightbox) */
  onOpen?: (project: Project) => void
  sizes?: string
  className?: string
}

/**
 * Photo-first project card: the image is the card, text sits on a navy gradient.
 */
export function ProjectCard({ project, featured = false, onOpen, sizes, className = "" }: ProjectCardProps) {
  const interactive = Boolean(onOpen)
  const Wrapper: "button" | "article" = interactive ? "button" : "article"

  return (
    <Wrapper
      type={interactive ? "button" : undefined}
      onClick={interactive ? () => onOpen?.(project) : undefined}
      aria-label={interactive ? `View photos: ${project.title}` : undefined}
      className={`group relative block w-full overflow-hidden rounded-xl bg-brand-navy text-left ring-1 ring-brand-navy/10 shadow-sm outline-none transition-shadow hover:shadow-lg focus-visible:ring-4 focus-visible:ring-brand-lime/60 ${featured ? "aspect-[4/3] lg:aspect-auto lg:h-full" : "aspect-[4/3]"} ${className}`}
    >
      <Image
        src={project.images[0]}
        alt={project.altText || `${project.title} - Professional electrical work in Northwest Chicago Suburbs`}
        fill
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        loading="lazy"
        quality={75}
        placeholder="blur"
        blurDataURL={createBlurPlaceholder(800, 600)}
        sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
      />

      {/* Readability gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/35 to-brand-navy/5"
        aria-hidden="true"
      />

      {/* Top row: category + photo count */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <span className="rounded-md bg-brand-lime px-2.5 py-1 text-xs font-semibold text-brand-navy">
          {project.category}
        </span>
        {project.images.length > 1 && (
          <span className="flex items-center gap-1.5 rounded-md bg-white/15 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Images className="h-3.5 w-3.5" aria-hidden="true" />
            {project.images.length}
          </span>
        )}
      </div>

      {/* Bottom: title + description */}
      <div className={`absolute inset-x-0 bottom-0 ${featured ? "p-5 md:p-7" : "p-5"}`}>
        <h3 className={`font-bold leading-tight text-white ${featured ? "text-xl md:text-2xl" : "text-lg"}`}>
          {project.title}
        </h3>
        <p className={`mt-1.5 text-white/75 ${featured ? "text-sm md:text-base line-clamp-2 md:line-clamp-3" : "text-sm line-clamp-2"}`}>
          {project.description}
        </p>
        <span
          className="mt-4 block h-0.5 w-10 rounded-full bg-brand-lime transition-all duration-300 group-hover:w-16"
          aria-hidden="true"
        />
      </div>
    </Wrapper>
  )
}
