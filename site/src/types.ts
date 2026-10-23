export interface CatalogEntity {
  name: string;
  description: string;
}

export interface CatalogPlugin {
  name: string;
  version: string;
  description: string;
  summary: string;
  keywords: string[];
  author: string;
  license: string;
  dependencies: string[];
  dir: string;
  composition: { skills: CatalogEntity[]; agents: CatalogEntity[] };
  updated: string;
}

export interface CatalogRelease {
  plugin: string;
  version: string;
  date: string;
  notes: string[];
}

export interface Catalog {
  generatedAt: string;
  marketplace: { name: string; repo: string; owner: string };
  counts: { plugins: number; skills: number; agents: number };
  plugins: CatalogPlugin[];
  releases: CatalogRelease[];
}

export type Kind = "plugin" | "skill" | "agent";

export interface SearchItem {
  kind: Kind;
  /** Entity name (plugin/skill/agent). */
  name: string;
  /** Owning plugin. */
  plugin: string;
  version: string;
  description: string;
  keywords: string[];
}
