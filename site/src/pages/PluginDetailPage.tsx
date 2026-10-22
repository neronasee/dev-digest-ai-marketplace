import { Link, useParams } from "react-router-dom";
import KindBadge from "../components/KindBadge";
import InstallCommand from "../components/InstallCommand";
import { catalog } from "../data/loader";
import { t } from "../i18n/en";

export default function PluginDetailPage() {
  const { name } = useParams();
  const plugin = catalog.plugins.find((p) => p.name === name);

  if (!plugin) return <div className="empty">{t.notFound}</div>;

  const githubUrl = `https://github.com/${catalog.marketplace.repo}/tree/main/${plugin.dir}`;

  return (
    <div className="detail">
      <Link className="backlink" to="/">← {t.detailBack}</Link>
      <h1>
        <span className="mono">{plugin.name}</span>
        <span className="ver">v{plugin.version}</span>
        <KindBadge kind="plugin" />
      </h1>
      <p className="lead">{plugin.description}</p>

      <dl>
        {plugin.author && (
          <div><b>{t.detailAuthor}:</b> {plugin.author}</div>
        )}
        {plugin.license && (
          <div><b>{t.detailLicense}:</b> {plugin.license}</div>
        )}
        {plugin.updated && (
          <div><b>{t.detailUpdated}:</b> {plugin.updated}</div>
        )}
      </dl>

      <InstallCommand name={plugin.name} />

      <h3>{t.detailComposition}</h3>
      <div className="entity-list">
        {plugin.composition.agents.map((a) => (
          <div className="entity" key={a.name}>
            <div className="head">
              <KindBadge kind="agent" />
              <span className="name">{a.name}</span>
            </div>
            <div className="desc">{a.description}</div>
          </div>
        ))}
        {plugin.composition.skills.map((s) => (
          <div className="entity" key={s.name}>
            <div className="head">
              <KindBadge kind="skill" />
              <span className="name">{s.name}</span>
            </div>
            <div className="desc">{s.description}</div>
          </div>
        ))}
      </div>

      <h3>{t.detailDependencies}</h3>
      {plugin.dependencies.length === 0 ? (
        <p className="lead">{t.detailNoDependencies}</p>
      ) : (
        <div className="dep-row">
          {plugin.dependencies.map((d) => (
            <Link to={`/plugin/${d}`} key={d} className="chip">{d}</Link>
          ))}
        </div>
      )}

      <h3>GitHub</h3>
      <p>
        <a href={githubUrl} target="_blank" rel="noreferrer">{t.detailViewOnGithub} ↗</a>
      </p>
    </div>
  );
}
