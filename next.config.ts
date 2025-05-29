import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        "https://api.daily.dev/devcards/v2/B18UDambwv8Sw8pdumYmh.png?type=wide&r=6xe"
      ),
    ],
  },
};

export default nextConfig;
