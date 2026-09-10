"use client"

import { useEffect, useState } from "react"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { downloadPdf, pdfDataUri } from "@/lib/estimate/pdf"
import type { EstimateData } from "@/lib/estimate/types"

type Result = { source: EstimateData; uri?: string; error?: string }

export function PdfPreview({ data, open, onOpenChange }: { data: EstimateData | null; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    if (!open || !data) return
    let cancelled = false
    pdfDataUri(data)
      .then((uri) => { if (!cancelled) setResult({ source: data, uri }) })
      .catch(() => { if (!cancelled) setResult({ source: data, error: "Could not build the preview. Try downloading instead." }) })
    return () => { cancelled = true }
  }, [open, data])

  const current = result && result.source === data ? result : null
  const busy = open && !!data && !current

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[calc(100dvh-1.5rem)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-lime-ink" aria-hidden="true" />
            {data?.documentType === "invoice" ? "Invoice preview" : "Estimate preview"}
          </DialogTitle>
          <DialogDescription>Check the document before sending it to the customer.</DialogDescription>
        </DialogHeader>
        <div className="relative flex-1 min-h-0 bg-secondary">
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-line border-t-brand-lime" aria-label="Building preview" />
            </div>
          )}
          {current?.error && <p className="p-6 text-center text-sm text-destructive">{current.error}</p>}
          {current?.uri && <iframe src={current.uri} title="PDF preview" className="h-full w-full" />}
        </div>
        <DialogFooter>
          <Button variant="accent" disabled={!data || busy} onClick={() => data && downloadPdf(data)}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
