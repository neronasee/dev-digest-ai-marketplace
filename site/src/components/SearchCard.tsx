import { Link } from "react-router-dom";
import KindBadge from "./KindBadge";
import type { SearchItem } from "../types";

/** One search result card: a plugin, skill, or agent. */
export default function SearchCard({ item }: { item: SearchItem }) {
  return (
    <Link to={`/plugin/${item.plugin}`} style={{ textDecoration: "none" }}>
      <div className="card">
        <div className="head">
          <KindBadge kind={item.kind} />
          <span className="name">{item.name}</span>
          {item.kind !== "plugin" && <span className="ver">via {item.plugin}</span>}
        </div>
        <div className="desc">{item.description}</div>
        <div className="meta">
          <span className="ver">v{item.version}</span>
        </div>
      </div>
    </Link>
  );
}
