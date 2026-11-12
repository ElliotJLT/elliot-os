import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/meta";

export const dynamic = "force-static";

// GitHub Pages serves a project site under /elliot-os, but crawlers only read
// robots.txt at the domain root, so on the project site this file is a
// courtesy. It starts working when a custom domain lands.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
