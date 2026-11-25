/** Ladezustand der Portfolio-Seite (Design Bible J): Skelett für Kennzahlen und Tabelle. */
export default function Loading() {
  return (
    <main className="flex flex-1 flex-col gap-8 p-8" aria-busy="true" aria-label="Produktpässe werden geladen">
      <div className="h-6 w-40 motion-safe:animate-pulse rounded-ui-sm border border-ui-border bg-surface-100" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 motion-safe:animate-pulse rounded-ui-xl border border-ui-border bg-surface-100" />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 motion-safe:animate-pulse rounded-ui-sm border border-ui-border bg-surface-100" />
        ))}
      </div>
    </main>
  );
}
