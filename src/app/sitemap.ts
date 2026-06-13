import type { MetadataRoute } from "next";
import { entries } from "@/data/entries";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl },
    { url: `${siteUrl}/about` },
    { url: `${siteUrl}/submit` },
    ...entries.map((e) => ({ url: `${siteUrl}/${e.slug}` })),
  ];
}
