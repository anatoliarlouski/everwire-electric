import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projects } from "@/lib/data/projects"
import { ProjectCard } from "@/components/project-card"

export function ProjectPreviewSection() {
  const [featured, ...rest] = projects.slice(0, 3)

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">Our Recent Projects</h2>
              <div className="mb-3 h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
              <p className="text-lg text-muted-foreground">
                Take a look at some of our completed electrical projects across the Northwest Suburbs of Chicago.
              </p>
            </div>
            <Link
              href="/gallery"
              className="hidden md:inline-flex items-center gap-2 font-semibold text-foreground hover:text-brand-lime-ink transition-colors"
            >
              View all projects
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Featured + two supporting cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
            {featured && (
              <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
                <ProjectCard
                  project={featured}
                  featured
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
            )}
            {rest.map((project) => (
              <ProjectCard key={project.id} project={project} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button size="lg" asChild>
              <Link href="/gallery">
                View All Projects
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
