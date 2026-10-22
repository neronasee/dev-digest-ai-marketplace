import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchInput from "../components/SearchInput";
import SearchCard from "../components/SearchCard";
import { buildSearchItems, searchItems } from "../lib/search";
import { catalog } from "../data/loader";
import { t } from "../i18n/en";
import type { Kind } from "../types";

type Filter = Kind | "all";
const FILTERS: Filter[] = ["all", "plugin", "skill", "agent"];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(() => buildSearchItems(catalog), []);
  const results = useMemo(() => searchItems(items, query, filter), [items, query, filter]);

  const counts = useMemo(() => {
    const all = searchItems(items, query, "all");
    return {
      all: all.length,
      plugin: all.filter((x) => x.kind === "plugin").length,
      skill: all.filter((x) => x.kind === "skill").length,
      agent: all.filter((x) => x.kind === "agent").length,
    };
  }, [items, query]);

  const label = (f: Filter) =>
    f === "all" ? `${t.filterAll} (${counts.all})` : `${f === "plugin" ? t.kindPlugin : f === "skill" ? t.kindSkill : t.kindAgent} (${counts[f]})`;

  return (
    <>
      <SearchInput initial={query} />
      <div className="filters">
        <span className="label">{t.filtersTitle}</span>
        {FILTERS.map((f) => (
          <button key={f} className={`chip${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
            {label(f)}
          </button>
        ))}
        {query && (
          <button className="chip" onClick={() => setParams({})}>{t.searchClear}</button>
        )}
      </div>
      <div className="section">
        <h2>
          {t.resultsTitle} <span className="more">{t.resultsCount(results.length)}</span>
        </h2>
        {results.length === 0 ? (
          <div className="empty">
            {t.resultsEmpty}
            <div className="hint">{t.resultsEmptyHint}</div>
          </div>
        ) : (
          <div className="grid">
            {results.map((item) => (
              <SearchCard key={`${item.kind}:${item.plugin}:${item.name}`} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
