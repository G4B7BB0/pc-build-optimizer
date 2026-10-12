"use client";

import { useEffect, useMemo, useState } from "react";
import { catalog, type ComponentCategory, type ComponentProduct } from "@/lib/catalog";
import { type Build, type BuildPreferences } from "@/lib/optimizer";
import { checkCompatibility } from "@/lib/compatibility";
import { downloadBuildCsv, downloadBuildJson } from "@/lib/export";

const initialPreferences: BuildPreferences = {
  budgetMax: 1400,
  budgetMin: 900,
  usage: "gaming",
  resolution: "1440p",
  refreshRate: 144,
  brandPreference: "any",
  caseSize: "mid",
  quiet: true,
  wifi: true,
  bluetooth: true,
  rgb: false,
};

const categoryLabels: Record<ComponentCategory, string> = {
  cpu: "CPU",
  gpu: "GPU",
  motherboard: "Scheda madre",
  ram: "RAM",
  storage: "SSD",
  psu: "Alimentatore",
  case: "Case",
  cooler: "Dissipatore",
};

export default function Home() {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [activeBuild, setActiveBuild] = useState(0);
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | null>(null);
  const [notice, setNotice] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const build = builds[activeBuild] ?? null;
  const compatibility = useMemo(() => (build ? checkCompatibility(build.components) : null), [build]);

  useEffect(() => {
    const saved = window.localStorage.getItem("forge:last-builds");
    if (saved) {
      try { const parsed = JSON.parse(saved) as { builds: Build[]; preferences: BuildPreferences }; setBuilds(parsed.builds); setPreferences(parsed.preferences); } catch { window.localStorage.removeItem("forge:last-builds"); }
    }
  }, []);

  function updatePreference<K extends keyof BuildPreferences>(key: K, value: BuildPreferences[K]) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  async function generate() {
    setIsGenerating(true);
    setNotice("");
    try {
      const response = await fetch("/api/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
      const rawResponse = await response.text();
      let payload: unknown;
      try {
        payload = JSON.parse(rawResponse);
      } catch {
        throw new Error(
          response.ok
            ? "Il server ha restituito una risposta non valida."
            : `Errore del server (${response.status}). Riavvia l'applicazione e riprova.`,
        );
      }
      if (!response.ok || !payload || typeof payload !== "object" || !("builds" in payload)) {
        const message = payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
          ? payload.error
          : `Errore del server (${response.status}).`;
        throw new Error(message);
      }
      const nextBuilds = (payload as { builds: Build[] }).builds;
      setBuilds(nextBuilds);
      setActiveBuild(0);
      window.localStorage.setItem("forge:last-builds", JSON.stringify({ builds: nextBuilds, preferences }));
      setNotice("Configurazione calcolata dal motore server con dati dimostrativi locali.");
      setSelectedCategory(null);
      setTimeout(() => document.getElementById("risultati")?.scrollIntoView({ behavior: "smooth" }), 0);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Generazione non riuscita.");
    } finally {
      setIsGenerating(false);
    }
  }

  function replaceComponent(product: ComponentProduct) {
    if (!build || !selectedCategory) return;
    const nextComponents = { ...build.components, [selectedCategory]: product };
    const total = Object.values(nextComponents).reduce((sum, component) => sum + component.price, 0);
    const nextBuild = {
      ...build,
      components: nextComponents,
      total,
      remaining: preferences.budgetMax - total,
      compatibility: checkCompatibility(nextComponents),
    };
    const nextBuilds = builds.map((candidate, index) => index === activeBuild ? nextBuild : candidate);
    setBuilds(nextBuilds);
    window.localStorage.setItem("forge:last-builds", JSON.stringify({ builds: nextBuilds, preferences }));
    setNotice(`${categoryLabels[selectedCategory]} aggiornato. Verifica gli avvisi prima di procedere.`);
    setSelectedCategory(null);
  }

  function duplicateActiveBuild() {
    if (!build) return;
    const copy = { ...build, name: `${build.name} · Variante`, components: { ...build.components } };
    const nextBuilds = [...builds, copy];
    setBuilds(nextBuilds);
    setActiveBuild(nextBuilds.length - 1);
    window.localStorage.setItem("forge:last-builds", JSON.stringify({ builds: nextBuilds, preferences }));
    setNotice("Variante duplicata e salvata localmente.");
  }

  function clearSavedBuilds() {
    setBuilds([]);
    setActiveBuild(0);
    window.localStorage.removeItem("forge:last-builds");
    setNotice("Configurazioni locali cancellate.");
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark">F</span> FORGE <span className="brand-muted">/ PC OPTIMIZER</span></a>
        <div className="topbar-meta"><span className="status-dot" /> Catalogo locale · Italia · EUR</div>
      </header>

      <section className="hero shell">
        <div className="eyebrow">CONFIGURATORE INTELLIGENTE <span>●</span> v0.1</div>
        <h1>La tua prossima build,<br /><em>progettata bene.</em></h1>
        <p className="hero-copy">Ottieni una configurazione equilibrata, compatibile e trasparente. Dati dimostrativi locali, nessun account e nessuna chiave API.</p>
        <div className="hero-actions">
          <button className="button button-primary" onClick={() => { setMode("auto"); setStep(1); document.getElementById("configuratore")?.scrollIntoView({ behavior: "smooth" }); }}>Crea la mia build <span>→</span></button>
          <button className="button button-ghost" onClick={() => { setMode("manual"); setStep(3); document.getElementById("configuratore")?.scrollIntoView({ behavior: "smooth" }); }}>Configura manualmente</button>
        </div>
        <div className="trust-row"><span>✓ Regole di compatibilità verificabili</span><span>✓ Prezzi dichiarati come demo</span><span>✓ Nessun dato personale richiesto</span></div>
      </section>

      <section className="config-section shell" id="configuratore">
        <div className="section-heading">
          <div><div className="eyebrow">01 — CONFIGURAZIONE</div><h2>Costruiamo qualcosa<br /><em>che abbia senso.</em></h2></div>
          <div className="stepper"><span className={step >= 1 ? "step active" : "step"}>01</span><i /><span className={step >= 2 ? "step active" : "step"}>02</span><i /><span className={step >= 3 ? "step active" : "step"}>03</span></div>
        </div>
        {mode === "auto" && step === 1 && (
          <div className="form-grid">
            <label className="field span-2"><span>Budget massimo <b>obbligatorio</b></span><div className="input-with-suffix"><input type="number" min="400" value={preferences.budgetMax} onChange={(e) => updatePreference("budgetMax", Number(e.target.value))} /><small>€</small></div></label>
            <label className="field"><span>Budget minimo <small>facoltativo</small></span><div className="input-with-suffix"><input type="number" min="0" value={preferences.budgetMin} onChange={(e) => updatePreference("budgetMin", Number(e.target.value))} /><small>€</small></div></label>
            <fieldset className="field span-3"><legend>Utilizzo principale</legend><div className="choice-row">{(["gaming", "productivity", "editing"] as const).map((usage) => <button type="button" className={preferences.usage === usage ? "choice selected" : "choice"} key={usage} onClick={() => updatePreference("usage", usage)}>{usage === "gaming" ? "Gaming" : usage === "productivity" ? "Produttività" : "Editing video"}<small>{usage === "gaming" ? "FPS, AAA, ultrawide" : usage === "productivity" ? "Lavoro, studio, sviluppo" : "Premiere, DaVinci, foto"}</small></button>)}</div></fieldset>
            <fieldset className="field span-3"><legend>Risoluzione target</legend><div className="choice-row compact">{(["1080p", "1440p", "4K"] as const).map((resolution) => <button type="button" className={preferences.resolution === resolution ? "choice selected" : "choice"} key={resolution} onClick={() => updatePreference("resolution", resolution)}>{resolution}</button>)}</div></fieldset>
            <div className="form-footer span-3"><span>Puoi modificare ogni scelta in seguito.</span><button className="button button-primary" onClick={() => setStep(2)}>Continua <span>→</span></button></div>
          </div>
        )}
        {mode === "auto" && step === 2 && (
          <div className="form-grid">
            <fieldset className="field span-3"><legend>Preferenza piattaforma</legend><div className="choice-row compact">{(["any", "amd", "intel", "nvidia"] as const).map((brand) => <button type="button" className={preferences.brandPreference === brand ? "choice selected" : "choice"} key={brand} onClick={() => updatePreference("brandPreference", brand)}>{brand === "any" ? "Nessuna" : brand.toUpperCase()}</button>)}</div></fieldset>
            <fieldset className="field"><legend>Formato case</legend><div className="choice-row compact vertical"><button type="button" className={preferences.caseSize === "mid" ? "choice selected" : "choice"} onClick={() => updatePreference("caseSize", "mid")}>Mid tower</button><button type="button" className={preferences.caseSize === "compact" ? "choice selected" : "choice"} onClick={() => updatePreference("caseSize", "compact")}>Compatto</button></div></fieldset>
            <fieldset className="field span-2"><legend>Preferenze</legend><label className="toggle-row"><input type="checkbox" checked={preferences.quiet} onChange={(e) => updatePreference("quiet", e.target.checked)} /><span>Silenziosità</span></label><label className="toggle-row"><input type="checkbox" checked={preferences.wifi} onChange={(e) => updatePreference("wifi", e.target.checked)} /><span>Wi-Fi integrato</span></label><label className="toggle-row"><input type="checkbox" checked={preferences.rgb} onChange={(e) => updatePreference("rgb", e.target.checked)} /><span>Illuminazione RGB</span></label></fieldset>
            <div className="form-footer span-3"><button className="button button-ghost" onClick={() => setStep(1)}>← Indietro</button><button className="button button-primary" disabled={isGenerating} onClick={generate}>{isGenerating ? "Calcolo in corso…" : "Genera la mia build"} <span>{isGenerating ? "…" : "✦"}</span></button></div>
          </div>
        )}
        {mode === "manual" && (
          <div className="manual-start"><div className="manual-icon">⌘</div><div><h3>Configurazione manuale</h3><p>Genera una base equilibrata e sostituisci ogni componente dalla schermata risultati. Gli avvisi vengono ricalcolati a ogni modifica.</p></div><button className="button button-primary" disabled={isGenerating} onClick={generate}>{isGenerating ? "Calcolo in corso…" : "Parti da una base"} <span>→</span></button></div>
        )}
      </section>

      {notice && <div className="notice shell"><span>✦</span>{notice}</div>}

      {build && (
        <section className="results shell" id="risultati">
          <div className="section-heading results-heading"><div><div className="eyebrow">02 — RISULTATI GENERATI</div><h2>{build.name}</h2><p className="section-subtitle">{build.summary}</p><div className="result-tabs">{builds.map((candidate, index) => <button key={`${candidate.strategy}-${index}`} className={index === activeBuild ? "result-tab active" : "result-tab"} onClick={() => setActiveBuild(index)}>{candidate.name}</button>)}</div></div><div className="result-actions"><button className="button button-ghost small" onClick={() => downloadBuildJson(build)}>JSON</button><button className="button button-ghost small" onClick={() => downloadBuildCsv(build)}>CSV</button><button className="button button-ghost small" onClick={() => window.print()}>Stampa</button><button className="button button-ghost small" onClick={duplicateActiveBuild}>Duplica</button><button className="button button-ghost small" onClick={clearSavedBuilds}>Cancella</button></div></div>
          <div className="metrics"><div><span>Totale stimato</span><strong>{build.total.toLocaleString("it-IT")} €</strong></div><div><span>Budget residuo</span><strong className={build.remaining < 0 ? "negative" : ""}>{build.remaining.toLocaleString("it-IT")} €</strong></div><div><span>Profilo</span><strong>{preferences.usage === "gaming" ? "Gaming" : preferences.usage === "editing" ? "Creator" : "Productività"}</strong></div><div><span>Confidenza</span><strong>{build.confidence}%</strong></div></div>
          <div className="result-layout"><div className="component-list"><div className="list-head"><span>COMPONENTI SELEZIONATI</span><span>PREZZO DEMO</span></div>{(Object.entries(build.components) as [ComponentCategory, ComponentProduct][]).map(([category, component]) => <button className="component-card" key={category} onClick={() => setSelectedCategory(category)}><span className="component-icon">{component.icon}</span><span className="component-info"><b>{categoryLabels[category]}</b><strong>{component.name}</strong><small>{component.shortSpec}</small></span><span className="component-price">{component.price.toLocaleString("it-IT")} €<small>Sostituisci →</small></span></button>)}</div>
            <aside className="insights"><div className="insight-card accent"><span className="card-kicker">VERDETTO FORGE</span><h3>{build.verdict}</h3><p>{build.explanation}</p></div><div className="insight-card"><span className="card-kicker">CONTROLLO COMPATIBILITÀ</span>{compatibility?.issues.length === 0 ? <p className="compat-ok">✓ Nessuna incompatibilità rilevata</p> : compatibility?.issues.map((issue) => <p className="compat-issue" key={issue.message}>! {issue.message}</p>)}<small className="muted">Controllo deterministico · dati disponibili</small></div><div className="insight-card"><span className="card-kicker">PUNTI CHIAVE</span><ul>{build.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div></aside></div>
          <div className="data-disclaimer"><span>ⓘ</span><p><b>Dati dimostrativi locali.</b> Prezzi, disponibilità e specifiche sono simulati per il prototipo e non rappresentano offerte commerciali aggiornate. Nessun link d’acquisto viene mostrato senza una fonte verificata.</p></div>
        </section>
      )}

      {selectedCategory && build && <div className="modal-backdrop" onClick={() => setSelectedCategory(null)}><div className="modal" onClick={(e) => e.stopPropagation()}><div className="modal-head"><div><div className="eyebrow">SOSTITUISCI COMPONENTE</div><h3>{categoryLabels[selectedCategory]}</h3></div><button className="close" onClick={() => setSelectedCategory(null)}>×</button></div><div className="alternatives">{catalog.filter((component) => component.category === selectedCategory).map((component) => { const selected = component.id === build.components[selectedCategory].id; return <button className={selected ? "alternative selected" : "alternative"} key={component.id} onClick={() => replaceComponent(component)}><span className="component-icon">{component.icon}</span><span><b>{component.name}</b><small>{component.shortSpec}</small></span><strong>{component.price.toLocaleString("it-IT")} €</strong>{selected && <em>IN USO</em>}</button>; })}</div></div></div>}
      <footer className="footer shell"><span>FORGE / PC BUILD OPTIMIZER</span><span>Prototipo locale · v0.1.0</span></footer>
    </main>
  );
}
