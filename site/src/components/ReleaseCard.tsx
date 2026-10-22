import { t } from "../i18n/en";
import type { CatalogRelease } from "../types";

export default function ReleaseCard({ release }: { release: CatalogRelease }) {
  return (
    <div className="release">
      <div className="head">
        <span className="plugin">{release.plugin}</span>
        <span className="ver">v{release.version}</span>
        {release.date && <span className="date">{release.date}</span>}
      </div>
      {release.notes.length > 0 && (
        <ul>
          {release.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
      {release.notes.length === 0 && <div className="date">{t.whatsNewEmpty}</div>}
    </div>
  );
}
