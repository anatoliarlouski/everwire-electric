"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react"
import { projects, categories, type Project } from "@/lib/data/projects"
import { createBlurPlaceholder } from "@/lib/utils/image"
import { ProjectCard } from "@/components/project-card"

function Lightbox({ project, onClose }: { project: Project; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const count = project.images.length

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose, next, prev])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-brand-navy/95 backdrop-blur-sm text-white"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 p-4 md:px-6">
        <div className="min-w-0">
          <span className="mb-1 inline-block rounded-md bg-brand-lime px-2.5 py-0.5 text-xs font-semibold text-brand-navy">
            {project.category}
          </span>
          <h3 className="truncate text-lg font-bold md:text-xl">{project.title}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Image */}
      <div className="relative flex flex-1 items-center justify-center px-4 md:px-16" onClick={onClose}>
        <div className="relative h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
          <Image
            key={project.images[index]}
            src={project.images[index]}
            alt={project.altText || project.title}
            fill
            className="object-contain"
            quality={85}
            priority
            sizes="100vw"
          />
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors md:left-5"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors md:right-5"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* Footer: description + thumbnails */}
      <div className="space-y-4 p-4 md:px-6">
        <p className="mx-auto max-w-3xl text-center text-sm text-white/75">{project.description}</p>
        {count > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Photos">
            {project.images.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Photo ${i + 1} of ${count}`}
                onClick={() => setIndex(i)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md ring-2 transition-all ${i === index ? "ring-brand-lime opacity-100" : "ring-transparent opacity-60 hover:opacity-100"}`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="80px" quality={75} />
              </button>
            ))}
          </div>
        )}
        {count > 1 && (
          <p className="text-center text-xs text-white/60">{index + 1} / {count}</p>
        )}
      </div>
    </div>
  )
}

export function ProjectGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects =
    selectedCategory === "All" ? projects : projects.filter((p) => p.category === selectedCategory)

  const countFor = (category: string) =>
    category === "All" ? projects.length : projects.filter((p) => p.category === category).length

  const closeGallery = useCallback(() => setSelectedProject(null), [])

  return (
    <section className="py-16 md:py-20 bg-secondary min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Project Gallery</h1>
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our portfolio of completed electrical projects across the Northwest Suburbs of Chicago.
              From residential upgrades to commercial installations, see the quality craftsmanship that sets us apart.
            </p>
          </div>

          {/* Category filter */}
          <div className="mb-10 flex justify-center">
            <div className="inline-flex rounded-full border border-border bg-card p-1" role="group" aria-label="Filter projects">
              {categories.map((category) => {
                const active = selectedCategory === category
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={active}
                    className={`flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active ? "bg-brand-navy text-white" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {category}
                    <span className={`rounded-full px-1.5 text-xs ${active ? "bg-white/15 text-white" : "bg-secondary text-muted-foreground"}`}>
                      {countFor(category)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onOpen={setSelectedProject} />
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <Images className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
              <p className="text-muted-foreground">Try selecting a different category to view projects.</p>
            </div>
          )}

          {selectedProject && <Lightbox project={selectedProject} onClose={closeGallery} />}
        </div>
      </div>
    </section>
  )
}
