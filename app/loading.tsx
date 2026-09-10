export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-lime mb-4" aria-hidden="true"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
