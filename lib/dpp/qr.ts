import QRCode from "qrcode";

/**
 * QR-Code als Druckdatei (SPEC §6.4): ISO/IEC 18004 über die Bibliothek `qrcode`,
 * Ruhezone 4 Module (EN 18220 §5, §6). Das SVG bauen wir aus der Modulmatrix selbst,
 * damit Kantenlänge in mm und der optionale Rahmen in derselben Datei stehen.
 */

export type ErrorCorrection = "L" | "M" | "Q" | "H";
export const ERROR_CORRECTION: ErrorCorrection[] = ["L", "M", "Q", "H"];
export const PRINT_SIZES_MM = [20, 30, 40] as const;
export type PrintSize = (typeof PRINT_SIZES_MM)[number];

/** Ruhezone in Modulen (EN 18220). */
export const QUIET_ZONE = 4;
/**
 * Rahmen nach IEC 61406: hier nur ein Rahmen von 1 Modul Stärke außerhalb der Ruhezone.
 * 🔴 Maße und Kennzeichnung nach IEC 61406 sind nicht in SPEC belegt (offene Frage).
 */
export const FRAME_WIDTH = 1;

/** Farben der Druckdatei aus tokens.css (surface-950, surface-0). Literal, weil die Datei ohne CSS auskommen muss. */
const DARK = "#09090b";
const LIGHT = "#ffffff";

export type QrOptions = { sizeMm: PrintSize; ecc: ErrorCorrection; iecFrame: boolean };

export function qrMatrix(text: string, ecc: ErrorCorrection): { size: number; isDark: (row: number, col: number) => boolean } {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: ecc });
  return { size: modules.size, isDark: (row, col) => !!modules.get(row, col) };
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * SVG mit Kantenlänge `sizeMm` (gesamte Datei inkl. Ruhezone und ggf. Rahmen).
 * viewBox in Modulen; Ursprung oben links an der Außenkante.
 */
export function buildQrSvg(text: string, { sizeMm, ecc, iecFrame }: QrOptions): string {
  const { size, isDark } = qrMatrix(text, ecc);
  const frame = iecFrame ? FRAME_WIDTH : 0;
  const offset = frame + QUIET_ZONE;
  const total = size + 2 * offset;

  let path = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isDark(r, c)) path += `M${c + offset} ${r + offset}h1v1h-1z`;
    }
  }

  const frameRect = iecFrame
    ? `<path fill="${DARK}" fill-rule="evenodd" d="M0 0h${total}v${total}h-${total}z M${frame} ${frame}v${total - 2 * frame}h${total - 2 * frame}v-${total - 2 * frame}z"/>`
    : "";

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${sizeMm}mm" height="${sizeMm}mm" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges" role="img">`,
    `<title>${escapeXml(`QR-Code: ${text}`)}</title>`,
    `<rect width="${total}" height="${total}" fill="${LIGHT}"/>`,
    frameRect,
    `<path fill="${DARK}" d="${path}"/>`,
    `</svg>`,
  ].join("");
}

export function qrFileName(dppId: string, { sizeMm, ecc, iecFrame }: QrOptions): string {
  return `dpp-${dppId}-${sizeMm}mm-${ecc}${iecFrame ? "-iec61406" : ""}.svg`;
}
