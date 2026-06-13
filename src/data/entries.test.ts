import { describe, expect, test } from "bun:test";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { entries, TACTIC_LABELS } from "@/data/entries";

const img = (p: string) => join(process.cwd(), "public", p);

describe("content integrity", () => {
  test("has at least one entry", () => {
    expect(entries.length).toBeGreaterThanOrEqual(1);
  });

  test("slugs are unique and kebab-case", () => {
    const slugs = entries.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  test("required fields are non-empty", () => {
    for (const e of entries) {
      expect(e.name.length).toBeGreaterThan(0);
      expect(e.story.length).toBeGreaterThanOrEqual(20);
      expect(e.story.length).toBeLessThanOrEqual(500);
      expect(Object.keys(TACTIC_LABELS)).toContain(e.tactic);
    }
  });

  test("years are sane", () => {
    for (const e of entries) {
      expect(e.thenYear).toBeGreaterThanOrEqual(1990);
      expect(e.thenYear).toBeLessThanOrEqual(new Date().getFullYear());
      if (e.nowYear) expect(e.nowYear).toBeGreaterThanOrEqual(e.thenYear);
    }
  });

  test("image files exist on disk", () => {
    for (const e of entries) {
      expect(existsSync(img(e.thenImage))).toBe(true);
      if (e.nowImage) expect(existsSync(img(e.nowImage))).toBe(true);
    }
  });

  test("community entries carry founder fields", () => {
    for (const e of entries.filter((x) => x.kind === "community")) {
      expect(e.founderName?.length).toBeGreaterThan(0);
      expect(e.founderLink?.length).toBeGreaterThan(0);
      expect(e.productUrl?.length).toBeGreaterThan(0);
    }
  });

  test("image paths follow the /screenshots/ convention", () => {
    const pattern = /^\/screenshots\/[a-z0-9-]+\.(png|jpg|webp)$/;
    for (const e of entries) {
      expect(e.thenImage).toMatch(pattern);
      if (e.nowImage) expect(e.nowImage).toMatch(pattern);
    }
  });

  test("links are http(s) URLs", () => {
    const httpish = /^https?:\/\//;
    for (const e of entries) {
      if (e.sourceUrl) expect(e.sourceUrl).toMatch(httpish);
      if (e.founderLink) expect(e.founderLink).toMatch(httpish);
      if (e.productUrl) expect(e.productUrl).toMatch(httpish);
    }
  });

  test("famous entries cite a source", () => {
    for (const e of entries.filter((x) => x.kind === "famous")) {
      expect(e.sourceUrl?.length).toBeGreaterThan(0);
    }
  });

  test("images are under the 500KB weight ceiling", () => {
    for (const e of entries) {
      const images = [e.thenImage, e.nowImage].filter(Boolean) as string[];
      for (const p of images) {
        expect(statSync(img(p)).size).toBeLessThan(500_000);
      }
    }
  });
});
