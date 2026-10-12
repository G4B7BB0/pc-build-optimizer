import type { ComponentCategory, ComponentProduct } from "./catalog";
export type CompatibilityIssue = { severity: "error" | "warning"; message: string };
export type CompatibilityReport = { status: "verified" | "incompatible" | "uncertain"; issues: CompatibilityIssue[] };
export function checkCompatibility(components: Partial<Record<ComponentCategory, ComponentProduct>>): CompatibilityReport {
  const issues: CompatibilityIssue[] = [];
  const cpu = components.cpu, motherboard = components.motherboard, ram = components.ram, gpu = components.gpu, psu = components.psu, pcCase = components.case, cooler = components.cooler;
  if (cpu && motherboard && cpu.socket !== motherboard.socket) issues.push({ severity: "error", message: `${cpu.name} usa socket ${cpu.socket}; la scheda madre richiede ${motherboard.socket}.` });
  if (ram && motherboard && ram.ramType !== motherboard.ramType) issues.push({ severity: "error", message: `La RAM ${ram.ramType} non è supportata dalla scheda madre (${motherboard.ramType}).` });
  if (gpu && pcCase && (gpu.gpuLength ?? 0) > (pcCase.gpuLength ?? Number.POSITIVE_INFINITY)) issues.push({ severity: "error", message: `La GPU è lunga ${gpu.gpuLength} mm, ma il case accetta ${pcCase.gpuLength} mm.` });
  if (motherboard && pcCase && motherboard.formFactor === "ATX" && pcCase.formFactor === "mATX") issues.push({ severity: "error", message: "La scheda madre ATX non entra nel case compatto mATX." });
  if (cooler && pcCase && (cooler.coolerHeight ?? 0) > 160) issues.push({ severity: "warning", message: `Verifica l'altezza del dissipatore (${cooler.coolerHeight} mm) nel case selezionato.` });
  if (gpu && psu && (psu.psuWattage ?? 0) < (gpu.requiredWattage ?? 0)) issues.push({ severity: "error", message: `L'alimentatore da ${psu.psuWattage} W è sotto il requisito consigliato di ${gpu.requiredWattage} W.` });
  if (motherboard && !motherboard.wifi) issues.push({ severity: "warning", message: "La scheda madre selezionata non dichiara Wi-Fi integrato." });
  if (!cpu || !motherboard || !ram || !gpu || !psu || !pcCase) {
    const incompleteIssues = [...issues, { severity: "warning" as const, message: "Dati insufficienti per verificare ogni requisito." }];
    return { status: issues.some((issue) => issue.severity === "error") ? "incompatible" : "uncertain", issues: incompleteIssues };
  }
  return { status: issues.some((issue) => issue.severity === "error") ? "incompatible" : issues.length ? "uncertain" : "verified", issues };
}
