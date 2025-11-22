// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add experimental flag for the React Compiler
  experimental: {
    reactCompiler: true,
  },
};

// Use export default for the .mjs module syntax
export default nextConfig;