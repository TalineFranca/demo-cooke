import type { MetadataRoute } from "next";
import { marca } from "@/data/marca";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: marca.siteUrl, changeFrequency: "weekly", priority: 1 }];
}
