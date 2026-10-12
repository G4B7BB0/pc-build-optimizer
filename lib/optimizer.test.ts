import { describe, expect, it } from "vitest";
import { generateBuild, generateBuilds } from "./optimizer";
describe("build generator", () => {
  const base = { budgetMin: 900, budgetMax: 1400, usage: "gaming" as const, resolution: "1440p" as const, refreshRate: 144, brandPreference: "any" as const, caseSize: "mid" as const, quiet: true, wifi: true, bluetooth: true, rgb: false };
  it("returns a build within budget", () => { const build = generateBuild(base)!; expect(build.total).toBeLessThanOrEqual(base.budgetMax); expect(build.components.cpu).toBeTruthy(); });
  it("returns no build for an invalid budget", () => expect(generateBuild({ ...base, budgetMax: 300 })).toBeNull());
  it("returns no build when the catalog cannot satisfy the budget", () => expect(generateBuild({ ...base, budgetMax: 400 })).toBeNull());
  it("returns distinct performance, balanced and value options when possible", () => {
    const builds = generateBuilds(base);
    expect(builds.length).toBeGreaterThanOrEqual(2);
    expect(new Set(builds.map((build) => build.strategy)).size).toBe(builds.length);
  });
});
