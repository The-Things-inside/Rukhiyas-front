/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Avoid dev-server cross-origin HMR issues when accessing via LAN IP.
  // Next expects host patterns (not full origin URLs).
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "172.20.10.8",
    "192.168.29.100",
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
