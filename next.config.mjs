/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false, // ✅ Tắt strict mode
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Add mysql2 as external to prevent bundling issues
      config.externals.push("mysql2");

      // Also add sequelize related externals
      config.externals.push("sequelize");
      config.externals.push("sequelize-typescript");

      // Add reflect-metadata
      config.externals.push("reflect-metadata");
    }

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: [
      "mysql2",
      "sequelize",
      "sequelize-typescript",
    ],
  },
};

export default nextConfig;
