import ReleaseCard from "../components/ReleaseCard";
import { catalog } from "../data/loader";
import { t } from "../i18n/en";

export default function WhatsNewPage() {
  return (
    <>
      <div className="hero">
        <h1>{t.whatsNewTitle}</h1>
        <p>{t.whatsNewSubtitle}</p>
      </div>
      {catalog.releases.length === 0 ? (
        <div className="empty">{t.whatsNewEmpty}</div>
      ) : (
        catalog.releases.map((r, i) => <ReleaseCard key={`${r.plugin}-${r.version}-${i}`} release={r} />)
      )}
    </>
  );
}
