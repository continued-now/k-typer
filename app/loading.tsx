export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="h-6 w-32 rounded bg-muted animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-8 w-8 sm:w-16 rounded bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="h-4 w-64 rounded bg-muted animate-pulse" />
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
