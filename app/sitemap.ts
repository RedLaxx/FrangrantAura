import type { MetadataRoute } from "next";
import { brands, products } from "@/lib/products";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  return [
    { url: base, lastModified: now, priority: 1 },
    { url: `${base}/shop`, lastModified: now, priority: 0.9 },
    { url: `${base}/brands`, lastModified: now, priority: 0.8 },
    { url: `${base}/about`, lastModified: now, priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, priority: 0.6 },
    ...brands.map((brand) => ({
      url: `${base}/brands/${brand.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
  ];
}
