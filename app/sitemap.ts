import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/meta";

export const dynamic = "force-static";

const PAGES = ["/", "/built/", "/writing/", "/evals/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({ url: `${SITE_URL}${p}` }));
}
