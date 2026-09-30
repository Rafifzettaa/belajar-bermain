import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bermain Belajar",
    short_name: "Bermain",
    description: "Permainan kecil untuk anak usia 3-6 tahun.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FBF6E4",
    theme_color: "#FFE9A8",
    lang: "id",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
