import { describe, expect, it } from "vitest";
import { importOffersCsv } from "./offers";

describe("offer import", () => {
  it("imports a local CSV without marking offers verified", () => {
    const offers = importOffersCsv("id;store;price;currency;availability;source;updatedAt\ncpu-7600;Demo Shop;199,90;EUR;demo;local;2026-10-12");
    expect(offers[0].price).toBe(199.9);
    expect(offers[0].verified).toBe(false);
  });
  it("rejects invalid currency", () => {
    expect(() => importOffersCsv("id;store;price;currency;availability;source;updatedAt\nx;shop;10;USD;demo;local;2026-10-12")).toThrow();
  });
});
