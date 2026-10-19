import type { MetadataRoute } from "next";
import { marca } from "@/data/marca";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${marca.siteUrl}/sitemap.xml` };
}
