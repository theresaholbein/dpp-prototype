import { AppMessage } from "@/components/ui/AppMessage";
import { AppTag } from "@/components/ui/AppTag";
import { PRODUCT_GROUPS } from "@/data/product-groups";
import { GRANULARITY_LABEL, STATUS_LABEL, STATUS_SEVERITY } from "@/lib/dpp/labels";
import { deriveWorkflowStatus } from "@/lib/dpp/status";
import type { Passport } from "@/lib/dpp/types";

/** Titel eines Passes mit Template, Ebene, Status und Banner der Produktgruppe (SPEC §5, §6.2). */
export function PassportTitle({ pass }: { pass: Passport }) {
  const group = PRODUCT_GROUPS[pass.productGroup];
  const status = deriveWorkflowStatus({ versionCount: pass.publishedVersions.length, registered: !!pass.registration });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold leading-tight text-ui-text-strong">{pass.productName}</h1>
        <div className="flex flex-wrap items-center gap-2 text-ui-text-muted">
          <span>
            {pass.sku} · {group.templateLabel} · Ebene {GRANULARITY_LABEL[pass.granularity]}
          </span>
          <AppTag value={STATUS_LABEL[status]} severity={STATUS_SEVERITY[status]} />
        </div>
      </div>
      <AppMessage severity="warn">{group.banner}</AppMessage>
    </div>
  );
}
