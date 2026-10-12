import type { ProductOffer } from "./catalog";

export function importOffersCsv(csv: string): ProductOffer[] {
  const lines = csv.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const header = lines[0].split(";").map((cell) => cell.trim().toLowerCase());
  const index = (name: string) => header.indexOf(name);
  const required = ["id", "store", "price", "currency", "availability", "source", "updatedat"];
  if (required.some((name) => index(name) < 0)) throw new Error(`Colonna obbligatoria mancante: ${required.find((name) => index(name) < 0)}`);
  return lines.slice(1).map((line, rowIndex) => {
    const cells = line.split(";").map((cell) => cell.trim());
    const price = Number(cells[index("price")].replace(",", "."));
    if (!Number.isFinite(price) || cells[index("currency")] !== "EUR") throw new Error(`Riga ${rowIndex + 2}: prezzo o valuta non validi`);
    return {
      id: cells[index("id")], store: cells[index("store")], price, currency: "EUR",
      availability: cells[index("availability")] as ProductOffer["availability"],
      source: cells[index("source")], updatedAt: cells[index("updatedat")],
      url: index("url") >= 0 ? cells[index("url")] : undefined,
      shipping: index("shipping") >= 0 ? Number(cells[index("shipping")].replace(",", ".")) : undefined,
      verified: false,
    };
  });
}
