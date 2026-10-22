/**
 * All UI strings live here — components must not hardcode copy.
 * English is the only shipped locale; the structure is i18n-ready.
 */
export const t = {
  siteTitle: "DevDigest AI Marketplace",
  siteSubtitle: "Plugins, skills, and agents for Claude Code — spec-driven development, distilled.",

  navHome: "Catalog",
  navWhatsNew: "What's new",

  searchPlaceholder: 'Search — e.g. "skill for react", "architecture reviewer", "zod"…',
  searchHint: "Keyword search across plugins, skills, and agents",
  searchClear: "Clear",

  statPlugins: "plugins",
  statSkills: "skills",
  statAgents: "agents",
  statIndexed: "index built",
  statReleases: "releases",

  filterAll: "All",
  kindPlugin: "plugin",
  kindSkill: "skill",
  kindAgent: "agent",
  filtersTitle: "Filter",

  homeBrowse: "Browse the catalog",
  homeWhatsNew: "Latest releases",

  resultsTitle: "Results",
  resultsCount: (n: number) => `${n} result${n === 1 ? "" : "s"}`,
  resultsEmpty: "Nothing matched. Try fewer or different keywords.",
  resultsEmptyHint: "The search covers names, keywords, and descriptions.",

  detailVersion: "version",
  detailAuthor: "author",
  detailLicense: "license",
  detailUpdated: "last release",
  detailDependencies: "Dependencies",
  detailNoDependencies: "No dependencies — standalone plugin.",
  detailComposition: "What's inside",
  detailViewOnGithub: "View on GitHub",
  detailBack: "Back to catalog",

  installTitle: "Install",
  installCopied: "Copied!",
  installCopy: "Copy",

  whatsNewTitle: "What's new",
  whatsNewSubtitle: "Release feed, generated from plugin changelogs at build time.",
  whatsNewEmpty: "No releases indexed yet.",

  footerNote: "Static catalog — the index is rebuilt from the repository's plugins/ on every deploy.",
  themeToggle: "Toggle light/dark theme",

  notFound: "Plugin not found.",
} as const;
