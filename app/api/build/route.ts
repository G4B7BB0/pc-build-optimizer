import { NextResponse } from "next/server";
import { z } from "zod";
import { generateBuilds } from "@/lib/optimizer";
import { getCatalog } from "@/lib/catalog-source";

export const dynamic = "force-dynamic";

const preferencesSchema = z.object({
  budgetMax: z.number().finite().min(400),
  budgetMin: z.number().finite().min(0),
  usage: z.enum(["gaming", "productivity", "editing", "streaming", "rendering", "programming", "office"]),
  resolution: z.enum(["1080p", "1440p", "4K"]),
  refreshRate: z.number().finite().min(30).max(500),
  brandPreference: z.enum(["any", "amd", "intel", "nvidia"]),
  caseSize: z.enum(["mid", "compact"]),
  quiet: z.boolean(),
  wifi: z.boolean(),
  bluetooth: z.boolean(),
  rgb: z.boolean(),
  excludeIds: z.array(z.string()).optional(),
  requiredIds: z.array(z.string()).optional(),
  ownedIds: z.array(z.string()).optional(),
  includeUsed: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const input = preferencesSchema.parse(await request.json());
    const products = await getCatalog();
    const builds = generateBuilds(input, products);

    if (builds.length === 0) {
      return NextResponse.json(
        { error: "Nessuna configurazione rispetta il budget e i vincoli selezionati." },
        { status: 422 },
      );
    }

    return NextResponse.json({ builds });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Le preferenze ricevute non sono valide." }, { status: 400 });
    }
    console.error("Build generation failed", error);
    return NextResponse.json({ error: "Impossibile generare la configurazione." }, { status: 500 });
  }
}
