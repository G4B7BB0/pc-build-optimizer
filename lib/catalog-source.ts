import { catalog, type ComponentProduct } from "./catalog";

const remoteCatalogUrl = process.env.CATALOG_API_URL;
const remoteCatalogToken = process.env.CATALOG_API_TOKEN;

export async function getCatalog(): Promise<ComponentProduct[]> {
  if (!remoteCatalogUrl) return catalog;
  const response = await fetch(remoteCatalogUrl, {
    headers: remoteCatalogToken ? { Authorization: `Bearer ${remoteCatalogToken}` } : undefined,
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Catalog API returned HTTP ${response.status}`);
  const payload = await response.json() as { products?: ComponentProduct[] };
  if (!Array.isArray(payload.products)) throw new Error("Catalog API response must contain products[]");
  return payload.products;
}
