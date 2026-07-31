import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos de plantilla. Cuando lleguen las fotos reales de Yadira pasan a
    // Supabase Storage y este patrón se reemplaza por el del bucket.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
