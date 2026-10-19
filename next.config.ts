import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // esconde a bolinha "N" do modo dev (fica no mesmo canto do WhatsApp)
  devIndicators: false,
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
