"use client";

import { ExternalLink } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { AppMessage } from "@/components/ui/AppMessage";
import { AppTag } from "@/components/ui/AppTag";
import { PRODUCT_GROUPS } from "@/data/product-groups";
import { GRANULARITY_LABEL, STATUS_LABEL, STATUS_SEVERITY } from "@/lib/dpp/labels";
import type { Passport } from "@/lib/dpp/types";
import { usePassState } from "@/lib/dpp/use-working-copy";

/**
 * Titel eines Passes mit Template, Ebene, Status und Banner der Produktgruppe (SPEC §5, §6.2).
 * Status inkl. Browser-Veröffentlichungen; der Link zur öffentlichen Seite nur, wenn dort eine Version ausgeliefert wird.
 */
export function PassportTitle({ pass }: { pass: Passport }) {
  const group = PRODUCT_GROUPS[pass.productGroup];
  const { status } = usePassState(pass);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <h1 className="break-words text-xl font-bold leading-tight text-ui-text-strong">{pass.productName}</h1>
          <div className="flex flex-wrap items-center gap-2 text-ui-text-muted">
            <span>
              {pass.sku} · {group.templateLabel} · Ebene {GRANULARITY_LABEL[pass.granularity]}
            </span>
            <AppTag value={STATUS_LABEL[status]} severity={STATUS_SEVERITY[status]} />
          </div>
        </div>
        {pass.publishedVersions.length > 0 ? (
          <AppButton href={`/p/${pass.dppId}`} variant="primary" mode="outlined" size="small" icon={ExternalLink} iconRight label="Öffentliche Passseite ansehen" />
        ) : null}
      </div>
      <AppMessage severity="warn">{group.banner}</AppMessage>
    </div>
  );
}
