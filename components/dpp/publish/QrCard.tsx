"use client";

import { Download, QrCode } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { CardHeading } from "@/components/ui/CardHeading";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ERROR_CORRECTION, PRINT_SIZES_MM, buildQrSvg, qrFileName, qrMatrix, type ErrorCorrection, type PrintSize } from "@/lib/dpp/qr";

/**
 * Datenträger (SPEC §6.4): QR nach ISO/IEC 18004, Ruhezone 4 Module (EN 18220 §5, §6).
 * Inhalt ist die Adresse der öffentlichen Passseite. Download als SVG in der gewählten Druckgröße.
 */
export function QrCard({ dppId, url, available }: { dppId: string; url: string; available: boolean }) {
  const [sizeMm, setSizeMm] = useState<PrintSize>(30);
  const [ecc, setEcc] = useState<ErrorCorrection>("M");
  const [iecFrame, setIecFrame] = useState(false);

  const options = { sizeMm, ecc, iecFrame };
  const svg = useMemo(() => buildQrSvg(url, { sizeMm, ecc, iecFrame }), [url, sizeMm, ecc, iecFrame]);
  const modules = useMemo(() => qrMatrix(url, ecc).size, [url, ecc]);

  const download = () => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = qrFileName(dppId, options);
    a.click();
    URL.revokeObjectURL(href);
  };

  return (
    <AppCard>
      <section aria-labelledby="qr-title" className="flex flex-col gap-4">
        <CardHeading id="qr-title" icon={QrCode}>
          Datenträger (QR-Code)
        </CardHeading>
        {available ? (
          <>
            <div className="flex flex-col items-center gap-2 rounded-ui-lg bg-ui-surface-muted p-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG aus dem Speicher, kein optimierbares Bild */}
              <img
                src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
                alt={`QR-Code mit der Adresse ${url}`}
                className="size-48 bg-surface-0"
              />
              <span className="text-center text-sm text-ui-text-muted">
                {sizeMm} × {sizeMm} mm · Fehlerkorrektur {ecc} · {modules} × {modules} Module
              </span>
            </div>
            <p className="break-all text-sm text-ui-text">
              <span className="text-ui-text-muted">Inhalt: </span>
              {url}
            </p>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ui-text">
                Druckgröße
              </span>
              <SegmentedControl
                label="Druckgröße"
                options={PRINT_SIZES_MM.map((s) => ({ value: String(s), label: `${s} mm` }))}
                value={String(sizeMm)}
                onChange={(v) => setSizeMm(Number(v) as PrintSize)}
              />
              <span className="text-xs text-ui-text-muted">Kantenlänge der Druckdatei inklusive Ruhezone und Rahmen.</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ui-text">Fehlerkorrektur</span>
              <SegmentedControl label="Fehlerkorrektur" options={ERROR_CORRECTION.map((e) => ({ value: e, label: e }))} value={ecc} onChange={setEcc} />
              <span className="text-xs text-ui-text-muted">Höhere Stufe: robuster bei Verschmutzung oder Beschädigung, dafür mehr und kleinere Module.</span>
            </div>
            <label className="flex min-h-6 cursor-pointer items-center gap-2 text-ui-text">
              <input type="checkbox" checked={iecFrame} onChange={(e) => setIecFrame(e.target.checked)} className="size-4 cursor-pointer accent-primary-500" />
              Rahmen nach IEC 61406
            </label>
            <p className="text-sm text-ui-text-muted">QR nach ISO/IEC 18004, Ruhezone 4 Module (EN 18220). Kodiert die Adresse der öffentlichen Passseite.</p>
            <AppButton variant="primary" mode="outlined" icon={Download} label="Als SVG herunterladen" onClick={download} />
          </>
        ) : (
          <p className="text-ui-text-muted">Der QR-Code steht nach der ersten Veröffentlichung bereit.</p>
        )}
      </section>
    </AppCard>
  );
}
