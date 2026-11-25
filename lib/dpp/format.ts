const DATE = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" });

/** „18.11.2026“ – feste Zeitzone, damit Server und Browser gleich rendern. */
export function formatDate(iso: string): string {
  return DATE.format(new Date(iso));
}
