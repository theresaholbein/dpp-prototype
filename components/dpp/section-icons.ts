import { BookOpen, FlaskConical, Layers, Leaf, ScanBarcode, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import type { SectionId } from "@/lib/dpp/types";

/** Icons der Template-Abschnitte für Kartenköpfe (Design Bible F: Kartenkopf mit Icon). */
export const SECTION_ICON: Record<SectionId, LucideIcon> = {
  identity: ScanBarcode,
  actors: Users,
  material: Layers,
  substances: FlaskConical,
  environment: Leaf,
  conformity: ShieldCheck,
  instructions: BookOpen,
};
