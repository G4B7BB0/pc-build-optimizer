import { describe, expect, it } from "vitest";
import { catalog } from "./catalog";
import { checkCompatibility } from "./compatibility";
const get = (id: string) => catalog.find((item) => item.id === id)!;
describe("compatibility engine", () => {
  it("accepts the demo AM5 build", () => expect(checkCompatibility({ cpu: get("cpu-7600"), motherboard: get("mb-b650"), ram: get("ram-32"), gpu: get("gpu-4060"), psu: get("psu-650"), case: get("case-meshify"), cooler: get("cooler-ak400") }).status).toBe("verified"));
  it("detects socket mismatch", () => expect(checkCompatibility({ cpu: get("cpu-14600k"), motherboard: get("mb-b650") }).issues[0].message).toContain("socket"));
  it("detects GPU power mismatch", () => expect(checkCompatibility({ gpu: get("gpu-7800xt"), psu: get("psu-650") }).status).toBe("incompatible"));
});
