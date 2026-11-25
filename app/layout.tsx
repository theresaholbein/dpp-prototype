import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const dmSans = localFont({
  src: [
    { path: "../docs/design-system/fonts/DMSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../docs/design-system/fonts/DMSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../docs/design-system/fonts/DMSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Code Gaia – Produktpässe (Prototyp)",
  description: "Klickbarer Prototyp des Digitalen Produktpasses",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  );
}
