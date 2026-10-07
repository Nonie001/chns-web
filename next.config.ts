import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/about/history", destination: "/about#history", permanent: true },
      { source: "/about/direction", destination: "/about#vision", permanent: true },
      { source: "/about/structure", destination: "/about#structure", permanent: true },
      { source: "/participate/donate", destination: "/participate#support", permanent: true },
      { source: "/participate/membership", destination: "/participate#membership", permanent: true },
    ];
  },
  experimental: {
    authInterrupts: true,
    serverActions: { bodySizeLimit: "20mb" },
  },
};

export default nextConfig;
