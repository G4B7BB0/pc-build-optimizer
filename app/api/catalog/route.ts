import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog-source";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const products = await getCatalog();
    const category = new URL(request.url).searchParams.get("category");
    const filtered = category ? products.filter((product) => product.category === category) : products;
    return NextResponse.json({
      products: filtered,
      source: process.env.CATALOG_API_URL ? "remote" : "local-demo",
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Catalog read failed", error);
    return NextResponse.json({ error: "Catalogo non disponibile." }, { status: 502 });
  }
}
