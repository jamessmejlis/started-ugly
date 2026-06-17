import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old launch subdomain → canonical domain (permanent / 308). Keep
      // drafts.marulho.co attached to the project for this to fire.
      {
        source: "/:path*",
        has: [{ type: "host", value: "drafts.marulho.co" }],
        destination: "https://shittyfirstdrafts.directory/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
