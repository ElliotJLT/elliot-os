import type { Metadata } from "next";

/** The live origin. The deploy sets BASE_PATH to "/elliot-os"; drop it when
 *  a custom domain lands and change ORIGIN with it. */
export const ORIGIN = "https://elliotjlt.github.io";
export const BASE_PATH = process.env.BASE_PATH || "";
export const SITE_URL = `${ORIGIN}${BASE_PATH}`;

const OG_IMAGE = {
  url: `${BASE_PATH}/og.png`,
  width: 1200,
  height: 630,
  alt: "Elliot Little: I ship AI for people who can't afford it to be wrong.",
};

/**
 * Title, description, canonical and share card for one page. Next replaces
 * openGraph wholesale when a page sets it, so every page goes through here
 * rather than inheriting half a card from the layout.
 */
export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  /** With a trailing slash, as the static export serves it: "/built/". */
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${BASE_PATH}${path}` },
    openGraph: {
      type: "website",
      siteName: "Elliot Little",
      locale: "en_GB",
      title,
      description,
      url: `${BASE_PATH}${path}`,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
