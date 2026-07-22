import type { NextConfig } from "next";

// BASE_PATH is set to "/elliot-os" by the deploy workflow (GitHub Pages project
// site). Unset locally and after a custom domain lands.
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.BASE_PATH || "",
  images: { unoptimized: true },
};

export default nextConfig;
