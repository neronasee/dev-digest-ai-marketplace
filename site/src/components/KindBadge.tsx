import { t } from "../i18n/en";
import type { Kind } from "../types";

export default function KindBadge({ kind }: { kind: Kind }) {
  const label = kind === "plugin" ? t.kindPlugin : kind === "skill" ? t.kindSkill : t.kindAgent;
  return <span className={`badge ${kind}`}>{label}</span>;
}
