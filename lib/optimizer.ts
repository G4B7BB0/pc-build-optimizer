import { catalog, type ComponentCategory, type ComponentProduct } from "./catalog";
import { checkCompatibility, type CompatibilityReport } from "./compatibility";
export type BuildPreferences = { budgetMax: number; budgetMin: number; usage: "gaming" | "productivity" | "editing" | "streaming" | "rendering" | "programming" | "office"; resolution: "1080p" | "1440p" | "4K"; refreshRate: number; brandPreference: "any" | "amd" | "intel" | "nvidia"; caseSize: "mid" | "compact"; quiet: boolean; wifi: boolean; bluetooth: boolean; rgb: boolean; excludeIds?: string[]; requiredIds?: string[]; ownedIds?: string[]; includeUsed?: boolean };
export type BuildStrategy = "performance" | "balanced" | "value";
export type Build = { strategy: BuildStrategy; name: string; summary: string; verdict: string; explanation: string; highlights: string[]; components: Record<ComponentCategory, ComponentProduct>; total: number; remaining: number; confidence: number; compatibility: CompatibilityReport };
const choose = (products: ComponentProduct[], category: ComponentCategory, id: string) => { const product = products.find((item) => item.category === category && item.id === id); if (!product) throw new Error(`Prodotto dimostrativo mancante: ${category}/${id}`); return product; };
export function generateBuild(preferences: BuildPreferences, products = catalog, strategy: BuildStrategy = "balanced"): Build | null {
  if (!Number.isFinite(preferences.budgetMax) || preferences.budgetMax < 400) return null;
  const ids = preferences.usage === "editing" || preferences.usage === "rendering" ? ["cpu-7700", "gpu-4070s", "mb-b650", "ram-64", "ssd-2tb", "psu-750", "case-meshify", "cooler-ak620"] : preferences.usage === "gaming" && preferences.resolution !== "1080p" ? ["cpu-7600", preferences.resolution === "4K" ? "gpu-7800xt" : "gpu-4070s", "mb-b650", "ram-32", "ssd-1tb", "psu-750", preferences.caseSize === "compact" ? "case-compact" : "case-meshify", "cooler-ak400"] : ["cpu-7600", "gpu-4060", "mb-b650", "ram-32", "ssd-1tb", "psu-650", preferences.caseSize === "compact" ? "case-compact" : "case-meshify", "cooler-ak400"];
  if (strategy === "performance" && preferences.usage === "gaming") {
    ids[0] = "cpu-7700";
    ids[1] = preferences.resolution === "1080p" ? "gpu-4070s" : "gpu-7800xt";
    ids[5] = "psu-750";
  }
  if (strategy === "value") {
    ids[0] = "cpu-7600";
    ids[1] = "gpu-4060";
    ids[3] = "ram-32";
    ids[4] = "ssd-1tb";
    ids[5] = "psu-650";
    ids[7] = "cooler-ak400";
  }
  const components = { cpu: choose(products, "cpu", ids[0]), gpu: choose(products, "gpu", ids[1]), motherboard: choose(products, "motherboard", ids[2]), ram: choose(products, "ram", ids[3]), storage: choose(products, "storage", ids[4]), psu: choose(products, "psu", ids[5]), case: choose(products, "case", ids[6]), cooler: choose(products, "cooler", ids[7]) };
  if (preferences.excludeIds?.some((id) => Object.values(components).some((component) => component.id === id))) return null;
  if (preferences.requiredIds?.some((id) => !Object.values(components).some((component) => component.id === id))) return null;
  const total = Object.values(components).reduce((sum, component) => sum + component.price, 0);
  if (total > preferences.budgetMax) {
    const affordableGpu = products.filter((product) => product.category === "gpu" && (product.price + total - components.gpu.price) <= preferences.budgetMax).sort((a, b) => b.price - a.price)[0];
    if (!affordableGpu) return null;
    components.gpu = affordableGpu;
  }
  const finalTotal = Object.values(components).reduce((sum, component) => preferences.ownedIds?.includes(component.id) ? sum : sum + component.price, 0);
  const finalCompatibility = checkCompatibility(components);
  const labels = { performance: "Migliore prestazione", balanced: "Miglior equilibrio", value: "Miglior risparmio" };
  return { strategy, name: `${labels[strategy]} · ${preferences.usage === "gaming" ? "Gaming" : preferences.usage === "editing" || preferences.usage === "rendering" ? "Creator" : "Productività"}`, summary: strategy === "performance" ? "Massimizza la potenza rispettando il budget disponibile." : strategy === "value" ? "Riduce il costo mantenendo una base coerente e aggiornabile." : "Bilancia prestazioni, costo e margine per futuri upgrade.", verdict: finalCompatibility.status === "verified" ? "Compatibilità verificata." : "Verifica necessaria.", explanation: "Il punteggio considera compatibilità, costo, bilanciamento CPU/GPU e possibilità di aggiornamento. I prezzi sono dimostrativi.", highlights: ["Piattaforma AM5 aggiornabile", preferences.ownedIds?.length ? "I componenti già posseduti non sono conteggiati" : "Totale riferito ai componenti da acquistare", preferences.quiet ? "Dissipatore a torre per un profilo acustico più curato" : "Profilo termico standard"], components, total: finalTotal, remaining: preferences.budgetMax - finalTotal, confidence: finalCompatibility.status === "verified" ? 94 : 78, compatibility: finalCompatibility };
}

export function generateBuilds(preferences: BuildPreferences, products = catalog): Build[] {
  return (["performance", "balanced", "value"] as const)
    .map((strategy) => generateBuild(preferences, products, strategy))
    .filter((build): build is Build => build !== null)
    .filter((build, index, builds) => index === builds.findIndex((candidate) => JSON.stringify(candidate.components) === JSON.stringify(build.components)));
}
