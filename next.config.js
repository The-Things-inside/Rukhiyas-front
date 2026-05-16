/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Avoid dev-server cross-origin HMR issues when accessing via LAN IP.
  // Next expects host patterns (not full origin URLs).
  allowedDevOrigins: [
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
    "0.0.0.0",
    "172.20.10.8",
    "172.20.10.8:3000",
    "192.168.29.100",
    "192.168.29.100:3000",
    "*.local",
  ],
  // Prevent dev-server cache corruption (.next/cache/webpack/*.pack.gz ENOENT)
  // which can trigger Fast Refresh full reloads and runtime module errors.
  webpack: (config, { dev }) => {
    if (dev) config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
