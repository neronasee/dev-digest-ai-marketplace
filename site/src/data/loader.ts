import type { Catalog } from "../types";
import raw from "./catalog.json";

/** The catalog is generated at build time from plugins/ — this is real data only. */
export const catalog = raw as Catalog;
