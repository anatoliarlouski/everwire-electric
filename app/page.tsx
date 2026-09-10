import type { Metadata } from "next"
import { PageContainer } from "@/components/layouts"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProjectPreviewSection } from "@/components/project-preview-section"
import { EstimateSection } from "@/components/estimate-section"

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return (
    <PageContainer theme="dark">
      <HeroSection />
      <ServicesSection />
      <ProjectPreviewSection />
      <EstimateSection />
    </PageContainer>
  )
}
