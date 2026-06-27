import type { MetadataRoute } from "next";
import { getCharacters } from "./lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = `https://${process.env.VERCEL_URL || "tangju.example.com"}`;
  const characters = await getCharacters();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/characters`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/timeline`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/chronicle`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/graph`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/galaxy`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/ranking`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const characterRoutes: MetadataRoute.Sitemap = characters.map((c) => ({
    url: `${baseUrl}/characters/${c.id}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...characterRoutes];
}
