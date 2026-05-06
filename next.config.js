/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Avoid dev-server cross-origin HMR issues when accessing via LAN IP.
  allowedDevOrigins: (() => {
    const hosts = ["localhost", "172.20.10.8"];
    const ports = Array.from({ length: 11 }, (_, i) => 3000 + i); // 3000-3010
    const protocols = ["http", "https"];
    return protocols.flatMap((proto) =>
      hosts.flatMap((host) => ports.map((port) => `${proto}://${host}:${port}`)),
    );
  })(),
  // Prevent dev-server cache corruption (.next/cache/webpack/*.pack.gz ENOENT)
  // which can trigger Fast Refresh full reloads and runtime module errors.
  webpack: (config, { dev }) => {
    if (dev) config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
