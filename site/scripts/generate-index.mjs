#!/usr/bin/env node
/**
 * Build-time catalog index generator.
 *
 * Scans the repository's plugins/ directory (real data only — no mocks) and
 * writes site/src/data/catalog.json. Runs automatically via `predev`/`prebuild`;
 * can be invoked directly with `npm run index`.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..");
const pluginsDir = join(repoRoot, "plugins");
const outFile = join(here, "..", "src", "data", "catalog.json");

/** Parse a YAML-ish frontmatter block (flat key: value pairs). */
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return out;
}

/** First markdown paragraph of the body (after frontmatter), used as a summary. */
function firstParagraph(text) {
  const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---/, "").trim();
  const para = body.split(/\r?\n\s*\r?\n/).find((p) => p.trim().length > 0) ?? "";
  return para.replace(/[#*`>\[\]]/g, "").replace(/\s+/g, " ").trim().slice(0, 220);
}

/** Parse CHANGELOG.md "## [x.y.z] - date" sections into release entries. */
function parseChangelog(text, plugin) {
  const releases = [];
  const re = /^## \[([^\]]+)\](?:\s*-\s*([^\s]+))?\s*$/gm;
  const matches = [...text.matchAll(re)];
  for (let i = 0; i < matches.length; i++) {
    const [, version, date = ""] = matches[i];
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const notes = text
      .slice(start, end)
      .split(/\r?\n/)
      .filter((l) => /^###?\s|^- /m.test(l))
      .map((l) => l.replace(/^###?\s*/, "").replace(/^- /, "").trim())
      .slice(0, 4);
    releases.push({ plugin, version, date, notes });
  }
  return releases;
}

function listAgents(pluginDir) {
  const dir = join(pluginDir, "agents");
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const fm = frontmatter(readFileSync(join(dir, f), "utf8"));
        return { name: fm.name ?? f.replace(/\.md$/, ""), description: fm.description ?? "" };
      });
  } catch {
    return [];
  }
}

function listSkills(pluginDir) {
  const dir = join(pluginDir, "skills");
  try {
    return readdirSync(dir)
      .filter((f) => {
        try {
          return statSync(join(dir, f)).isDirectory() && (f === "." || true);
        } catch {
          return false;
        }
      })
      .filter((f) => {
        try {
          return readFileSync(join(dir, f, "SKILL.md"), "utf8").length >= 0;
        } catch {
          return false;
        }
      })
      .map((f) => {
        const fm = frontmatter(readFileSync(join(dir, f, "SKILL.md"), "utf8"));
        return { name: fm.name ?? f, description: fm.description ?? "" };
      });
  } catch {
    return [];
  }
}

const marketplaceManifest = JSON.parse(readFileSync(join(repoRoot, ".claude-plugin", "marketplace.json"), "utf8"));

const plugins = [];
const releases = [];

for (const entry of readdirSync(pluginsDir)) {
  const pluginDir = join(pluginsDir, entry);
  if (!statSync(pluginDir).isDirectory()) continue;

  let manifest = {};
  try {
    manifest = JSON.parse(readFileSync(join(pluginDir, ".claude-plugin", "plugin.json"), "utf8"));
  } catch {
    console.warn(`warn: ${entry} has no .claude-plugin/plugin.json — skipped`);
    continue;
  }

  let readme = "";
  try {
    readme = readFileSync(join(pluginDir, "README.md"), "utf8");
  } catch {}

  let changelog = "";
  try {
    changelog = readFileSync(join(pluginDir, "CHANGELOG.md"), "utf8");
  } catch {}

  const skills = listSkills(pluginDir);
  const agents = listAgents(pluginDir);
  const pluginReleases = changelog ? parseChangelog(changelog, manifest.name) : [];
  releases.push(...pluginReleases);

  plugins.push({
    name: manifest.name ?? entry,
    version: manifest.version ?? "0.0.0",
    description: manifest.description ?? "",
    summary: readme ? firstParagraph(readme) : manifest.description ?? "",
    keywords: manifest.keywords ?? [],
    author: manifest.author?.name ?? "",
    license: manifest.license ?? "",
    dependencies: manifest.dependencies ?? [],
    dir: relative(repoRoot, pluginDir),
    composition: { skills, agents },
    updated: pluginReleases[0]?.date ?? "",
  });
}

plugins.sort((a, b) => a.name.localeCompare(b.name));
releases.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

const catalog = {
  generatedAt: new Date().toISOString(),
  marketplace: {
    name: marketplaceManifest.name,
    repo: "neronasee/dev-digest-ai-marketplace",
    owner: marketplaceManifest.owner?.name ?? "",
  },
  counts: {
    plugins: plugins.length,
    skills: plugins.reduce((n, p) => n + p.composition.skills.length, 0),
    agents: plugins.reduce((n, p) => n + p.composition.agents.length, 0),
  },
  plugins,
  releases: releases.slice(0, 30),
};

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(catalog, null, 2) + "\n");
console.log(
  `index: ${catalog.counts.plugins} plugins, ${catalog.counts.skills} skills, ${catalog.counts.agents} agents, ${catalog.releases.length} releases -> ${relative(repoRoot, outFile)}`
);
