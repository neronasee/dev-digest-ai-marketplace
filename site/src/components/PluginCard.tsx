import { Link } from "react-router-dom";
import KindBadge from "./KindBadge";
import type { CatalogPlugin } from "../types";

export default function PluginCard({ plugin }: { plugin: CatalogPlugin }) {
  const skills = plugin.composition.skills.length;
  const agents = plugin.composition.agents.length;
  return (
    <Link to={`/plugin/${plugin.name}`} style={{ textDecoration: "none" }}>
      <div className="card">
        <div className="head">
          <KindBadge kind="plugin" />
          <span className="name">{plugin.name}</span>
          <span className="ver">v{plugin.version}</span>
        </div>
        <div className="desc">{plugin.summary || plugin.description}</div>
        <div className="meta">
          <span>{agents} agent{agents === 1 ? "" : "s"}</span>
          <span>·</span>
          <span>{skills} skill{skills === 1 ? "" : "s"}</span>
          {plugin.dependencies.length > 0 && (
            <>
              <span>·</span>
              <span>{plugin.dependencies.length} dep{plugin.dependencies.length === 1 ? "" : "s"}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
