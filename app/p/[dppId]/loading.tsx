/** Ladezustand der öffentlichen Passseite (Design Bible J): Skelett im Aufbau der Seite, mobil zuerst. */
export default function Loading() {
  const block = "motion-safe:animate-pulse border border-ui-border bg-surface-100";
  return (
    <main aria-busy="true" aria-label="Produktpass wird geladen" className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-2">
        <div className={`h-4 w-32 rounded-ui-sm ${block}`} />
        <div className={`h-8 w-3/4 rounded-ui-sm ${block}`} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-20 rounded-ui-xl ${block}`} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-12 rounded-ui-xl ${block}`} />
        ))}
      </div>
    </main>
  );
}
