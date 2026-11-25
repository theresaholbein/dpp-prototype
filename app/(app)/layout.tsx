import { existsSync } from "node:fs";
import path from "node:path";
import { Sidebar } from "@/components/shell/Sidebar";

/** App-Shell: Sidebar links, rechts Kopfzeile und Inhalt der jeweiligen Seite. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Navy-Logo auf weißer Sidebar; Logo_off-white.svg ist für dunkle Flächen.
  const hasLogo = existsSync(path.join(process.cwd(), "public", "Logo_navy.svg"));

  return (
    <div className="flex min-h-screen">
      <Sidebar hasLogo={hasLogo} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
