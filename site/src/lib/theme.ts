/** Dark-first theming: dark is the default, light is an opt-in persisted choice. */
const KEY = "catalog-theme";

export function initialTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.localStorage.getItem(KEY) === "light" ? "light" : "dark";
}

export function applyTheme(theme: "dark" | "light") {
  document.documentElement.dataset.theme = theme;
}

export function setTheme(theme: "dark" | "light") {
  window.localStorage.setItem(KEY, theme);
  applyTheme(theme);
}
