import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, FileDown, UserRound } from "lucide-react";
import { getPassportByDppId } from "@/lib/dpp/passports";
import { LANGUAGES, PUBLIC_TEXT, buildPublicView, fileTypeLabel, parseLanguage, type LocalText } from "@/lib/dpp/public-view";

type Props = { params: Promise<{ dppId: string }>; searchParams: Promise<{ lang?: string | string[] }> };

/** Letzte veröffentlichte Demo-Version; ohne Version nicht erreichbar (SPEC §5, Entscheidung 25.11.2026). */
async function load(props: Props) {
  const pass = getPassportByDppId((await props.params).dppId);
  const version = pass?.publishedVersions.at(-1);
  if (!pass || !version) return null;
  return { pass, view: buildPublicView(pass, version, parseLanguage((await props.searchParams).lang)) };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const data = await load(props);
  if (!data) return { title: "Produktpass nicht gefunden" };
  return {
    title: `${data.view.productName.text} – ${PUBLIC_TEXT[data.view.lang].passLabel}`,
    robots: { index: false },
  };
}

/** Text mit lang-Attribut, wenn er nicht in der Seitensprache vorliegt. */
function Txt({ value, page }: { value: LocalText; page: string }) {
  return value.lang && value.lang !== page ? <span lang={value.lang}>{value.text}</span> : <>{value.text}</>;
}

/**
 * Öffentliche Passseite (SPEC §6.7): ohne App-Shell, mobil zuerst, nur Felder „Öffentlich“.
 * Ohne JavaScript bedienbar: Sprache per Link, Abschnitte und „Zugang für Fachleute“ per <details>.
 */
export default async function PublicPassportPage(props: Props) {
  const data = await load(props);
  if (!data) notFound();
  const { pass, view } = data;
  const t = PUBLIC_TEXT[view.lang];

  return (
    <div lang={view.lang} className="flex min-h-screen flex-col bg-ui-page">
      <header className="border-b border-ui-border-hairline bg-ui-surface">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-2 px-4 py-2">
          <span className="text-sm font-medium text-ui-text-muted">{t.passLabel}</span>
          <nav aria-label={t.language} className="flex gap-1 rounded-ui-lg border border-ui-border p-1">
            {LANGUAGES.map((l) => {
              const active = l === view.lang;
              return (
                <Link
                  key={l}
                  href={l === "de" ? `/p/${pass.dppId}` : `/p/${pass.dppId}?lang=${l}`}
                  hrefLang={l}
                  lang={l}
                  aria-current={active ? "true" : undefined}
                  aria-label={l === "de" ? "Deutsch" : "English"}
                  className={`flex min-h-10 min-w-10 items-center justify-center rounded-ui-sm border px-2 text-sm font-medium ${
                    active ? "border-primary-500 bg-ui-surface-selected text-primary-500" : "border-transparent text-gray-dark hover:bg-surface-100"
                  }`}
                >
                  {t.languages[l]}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-4 py-8">
        <div className="flex flex-col gap-2">
          {view.manufacturer ? <span className="text-sm text-ui-text-muted">{view.manufacturer}</span> : null}
          <h1 className="break-words text-2xl font-bold leading-tight text-ui-text-strong">
            <Txt value={view.productName} page={view.lang} />
          </h1>
          <span className="text-ui-text">{view.subtitle}</span>
        </div>

        {view.facts.length > 0 ? (
          <section aria-labelledby="facts-title" className="flex flex-col gap-2">
            <h2 id="facts-title" className="sr-only">
              {t.keyFacts}
            </h2>
            <dl className="grid grid-cols-2 gap-2">
              {view.facts.map((f) => (
                <div key={f.label} className="flex flex-col gap-1 rounded-ui-xl border border-ui-border bg-ui-surface p-4">
                  <dt className="text-sm text-ui-text-muted">{f.label}</dt>
                  <dd className="break-words font-medium text-ui-text-strong">
                    <Txt value={f.value} page={view.lang} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section aria-labelledby="details-title" className="flex flex-col gap-2">
          <h2 id="details-title" className="text-lg font-medium text-ui-text-strong">
            {t.details}
          </h2>
          {view.sections.map((s, i) => (
            <details key={s.id} open={i === 0} className="group rounded-ui-xl border border-ui-border bg-ui-surface">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 rounded-ui-xl px-4 py-2 font-medium text-ui-text-strong [&::-webkit-details-marker]:hidden">
                <span>{s.title}</span>
                <ChevronDown size={20} aria-hidden="true" className="shrink-0 text-primary-500 transition-transform duration-(--ui-duration) group-open:rotate-180" />
              </summary>
              <dl className="flex flex-col gap-4 border-t border-ui-border-hairline p-4">
                {s.rows.map((r) => (
                  <div key={r.elementId} className="flex flex-col">
                    <dt className="text-sm text-ui-text-muted">{r.label}</dt>
                    <dd className={`break-words ${r.value ? "text-ui-text-strong" : "text-ui-text-muted"}`}>
                      {r.value ? <Txt value={r.value} page={view.lang} /> : t.notProvided}
                    </dd>
                  </div>
                ))}
              </dl>
            </details>
          ))}
        </section>

        <section aria-labelledby="docs-title" className="flex flex-col gap-2">
          <h2 id="docs-title" className="text-lg font-medium text-ui-text-strong">
            {t.documents}
          </h2>
          {view.documents.length === 0 ? (
            <p className="rounded-ui-xl border border-ui-border bg-ui-surface p-4 text-ui-text-muted">{t.noDocuments}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {view.documents.map((d) => {
                const type = fileTypeLabel(d.mimeType);
                const meta = [type, d.languages?.map((l) => t.languages[l]).join(", ")].filter(Boolean).join(" · ");
                return (
                  <li key={d.elementId}>
                    <a
                      href={d.href}
                      type={d.mimeType}
                      hrefLang={d.languages?.length === 1 ? d.languages[0] : undefined}
                      className="flex min-h-12 items-center gap-2 rounded-ui-xl border border-ui-border bg-ui-surface p-4 font-medium text-primary-500 hover:text-primary-700"
                    >
                      <FileDown size={20} aria-hidden="true" className="shrink-0" />
                      <span className="min-w-0 flex-1 break-words">
                        <Txt value={d.title} page={view.lang} />
                      </span>
                      {meta ? <span className="shrink-0 text-sm font-regular text-ui-text-muted">{meta}</span> : null}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <details className="flex flex-col">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-center gap-2 rounded-ui-sm border border-primary-500 bg-ui-surface px-3 py-2 font-medium text-primary-500 hover:bg-primary-50 [&::-webkit-details-marker]:hidden">
            <UserRound size={20} aria-hidden="true" />
            {t.pro}
          </summary>
          <p className="mt-2 rounded-ui-sm border border-primary-500 bg-primary-50 p-2 text-primary-600">{t.proText}</p>
        </details>
      </main>

      <footer className="border-t border-ui-border-hairline bg-ui-surface">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-1 px-4 py-4 text-sm text-ui-text-muted">
          {/* Label und Wert fließen als Text: lange Werte brechen in derselben Zeile um, statt als Block unter das Label zu rutschen. */}
          <dl className="flex flex-col gap-1">
            <div>
              <dt className="inline">{t.dppId}: </dt>
              <dd className="inline break-all">{view.footer.dppId}</dd>
            </div>
            <div>
              <dt className="inline">{t.version}: </dt>
              <dd className="inline">
                v{view.footer.version} · {t.updated}: {view.footer.updated}
              </dd>
            </div>
            {view.footer.operator ? (
              <div>
                <dt className="inline">{t.operator}: </dt>
                <dd className="inline">
                  {view.footer.operator} · {t.hosted}
                </dd>
              </div>
            ) : null}
          </dl>
          <p>{t.demo}</p>
        </div>
      </footer>
    </div>
  );
}
