import { Link } from "react-router-dom";
import SearchInput from "../components/SearchInput";
import PluginCard from "../components/PluginCard";
import ReleaseCard from "../components/ReleaseCard";
import { catalog } from "../data/loader";
import { t } from "../i18n/en";

export default function HomePage() {
  const date = new Date(catalog.generatedAt);
  const indexed = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  return (
    <>
      <div className="hero">
        <h1>{t.siteTitle}</h1>
        <p>{t.siteSubtitle}</p>
        <SearchInput />
        <div className="search-hint">{t.searchHint}</div>
      </div>

      <div className="stats">
        <div className="stat"><b>{catalog.counts.plugins}</b><span>{t.statPlugins}</span></div>
        <div className="stat"><b>{catalog.counts.skills}</b><span>{t.statSkills}</span></div>
        <div className="stat"><b>{catalog.counts.agents}</b><span>{t.statAgents}</span></div>
        <div className="stat"><b>{catalog.releases.length}</b><span>{t.statReleases}</span></div>
        <div className="stat"><b>{indexed}</b><span>{t.statIndexed}</span></div>
      </div>

      <div className="section">
        <h2>{t.homeBrowse}</h2>
        <div className="grid">
          {catalog.plugins.map((p) => (
            <PluginCard key={p.name} plugin={p} />
          ))}
        </div>
      </div>

      <div className="section">
        <h2>
          {t.homeWhatsNew}
          <Link className="more" to="/whats-new">{t.navWhatsNew} →</Link>
        </h2>
        {catalog.releases.slice(0, 3).map((r, i) => (
          <ReleaseCard key={`${r.plugin}-${r.version}-${i}`} release={r} />
        ))}
      </div>
    </>
  );
}
