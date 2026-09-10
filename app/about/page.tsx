import type { Metadata } from "next"
import { PageContainer, ContentSection } from "@/components/layouts"
import { AboutSection } from "@/components/about-section"
import { BUSINESS } from "@/lib/constants"

export const metadata: Metadata = {
  title: `About Us - Licensed Electricians | ${BUSINESS.name}`,
  description: `Learn about ${BUSINESS.name} - licensed, insured electrical contractors serving Northwest Chicago Suburbs since ${BUSINESS.founded}. 15+ years of experience, 500+ projects completed.`,
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <PageContainer theme="light">
      <ContentSection withCard={false} noPadding>
        <AboutSection />
      </ContentSection>
    </PageContainer>
  )
}
