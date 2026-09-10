import type { Metadata } from "next"
import { PageContainer } from "@/components/layouts"
import { EstimateBuilder } from "@/components/estimate/estimate-builder"
import { BUSINESS } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Estimate Builder | ${BUSINESS.name}`,
  description: "Internal tool for building electrical estimates and invoices.",
  robots: { index: false, follow: false },
}

export default function EstimateBuilderPage() {
  return (
    <PageContainer variant="tool">
      <EstimateBuilder />
    </PageContainer>
  )
}
