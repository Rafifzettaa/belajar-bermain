import type { Metadata, Viewport } from "next";
import { Baloo_2 } from "next/font/google";
import { MusicBoot } from "@/components/MusicBoot";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bermain Belajar",
  description: "Permainan kecil untuk anak usia 3-6 tahun. Tanpa akun, tanpa iklan.",
  applicationName: "Bermain Belajar",
  appleWebApp: { capable: true, title: "Bermain Belajar", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFE9A8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={baloo.variable}>
      <body className="min-h-dvh antialiased">
        <MusicBoot />
        {children}
      </body>
    </html>
  );
}
