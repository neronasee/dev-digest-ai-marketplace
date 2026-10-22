import type { Catalog, SearchItem, Kind } from "../types";

/** Flatten the catalog into searchable cards. */
export function buildSearchItems(catalog: Catalog): SearchItem[] {
  const items: SearchItem[] = [];
  for (const p of catalog.plugins) {
    items.push({
      kind: "plugin",
      name: p.name,
      plugin: p.name,
      version: p.version,
      description: p.summary || p.description,
      keywords: p.keywords,
    });
    for (const s of p.composition.skills) {
      items.push({ kind: "skill", name: s.name, plugin: p.name, version: p.version, description: s.description, keywords: [] });
    }
    for (const a of p.composition.agents) {
      items.push({ kind: "agent", name: a.name, plugin: p.name, version: p.version, description: a.description, keywords: [] });
    }
  }
  return items;
}

/** Score one item against the query: name > keywords > description. */
function score(item: SearchItem, tokens: string[]): number {
  const name = item.name.toLowerCase();
  const plugin = item.plugin.toLowerCase();
  const haystack = item.description.toLowerCase();
  const keywords = item.keywords.map((k) => k.toLowerCase()).join(" ");
  let total = 0;
  for (const tk of tokens) {
    let hit = 0;
    if (name === tk) hit += 50;
    else if (name.includes(tk)) hit += 25;
    if (plugin.includes(tk)) hit += 8;
    if (keywords.includes(tk)) hit += 12;
    if (haystack.includes(tk)) hit += 6;
    if (hit === 0) return 0; // every token must match somewhere
    total += hit;
  }
  // recency/naming tiebreak: plugins slightly over their members
  if (item.kind === "plugin") total += 2;
  return total;
}

export function searchItems(items: SearchItem[], query: string, kind: Kind | "all"): SearchItem[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const pool = tokens.length === 0 && kind !== "all" ? items : items;
  let scored = pool.map((item) => ({ item, s: score(item, tokens) }));
  if (tokens.length > 0) scored = scored.filter((x) => x.s > 0);
  scored = scored.filter((x) => kind === "all" || x.item.kind === kind);
  scored.sort((a, b) => b.s - a.s || a.item.name.localeCompare(b.item.name));
  return scored.map((x) => x.item);
}
