/** Ladezustand der Portfolio-Seite (Design Bible J): Skelett für Kennzahlen und Tabelle. */
export default function Loading() {
  return (
    <main className="flex flex-1 flex-col gap-8 p-8" aria-busy="true" aria-label="Produktpässe werden geladen">
      <div className="h-6 w-40 animate-pulse rounded-ui-sm bg-surface-200" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-ui-xl bg-surface-200" />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-ui-sm bg-surface-200" />
        ))}
      </div>
    </main>
  );
}
