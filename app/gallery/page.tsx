import { PageContainer } from "@/components/layouts"
import { ProjectGallery } from "@/components/project-gallery"
import { BUSINESS, CONTACT } from "@/lib/constants"

export const metadata = {
  title: `Project Gallery | ${BUSINESS.name} - Electrical Contractor`,
  description: `View our completed electrical projects across residential, commercial, and industrial sectors in the ${CONTACT.location.region}.`,
  keywords: "electrical projects, gallery, residential electrical, commercial electrical, Chicago electrician, electrical contractor portfolio",
  alternates: {
    canonical: '/gallery',
  },
}

export default function GalleryPage() {
  return (
    <PageContainer>
      <ProjectGallery />
    </PageContainer>
  )
}
