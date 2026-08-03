import type { MetadataRoute } from "next";
import { PURPOSES, YEARS } from "@/lib/koyomi";

const BASE_URL = "https://kichijitsu.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: BASE_URL, lastModified, changeFrequency: "monthly", priority: 1.0 },
    ...PURPOSES.map((p) => ({
      url: `${BASE_URL}/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...YEARS.flatMap((y) =>
      Array.from({ length: 12 }, (_, i) => ({
        url: `${BASE_URL}/calendar/${y}/${i + 1}`,
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.6,
      })),
    ),
    {
      url: `${BASE_URL}/articles`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...["ichiryu-manbaibi", "tenshabi", "rokuyo"].map((slug) => ({
      url: `${BASE_URL}/articles/${slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
