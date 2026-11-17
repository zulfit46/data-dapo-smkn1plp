import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIM Dapodik — SMKN 1 Palopo",
  description: "Aplikasi pengelolaan data siswa terintegrasi Google Sheets dengan biodata peserta didik, registrasi, data periodik, presensi, dan panel script code.gs.",
  keywords: ["SIM Dapodik", "SMKN 1 Palopo", "Dapodik", "Peserta Didik", "GTK", "Google Sheets"],
  authors: [{ name: "SMKN 1 Palopo" }],
  icons: {
    icon: "/dapo.png",
    shortcut: "/dapo.png",
    apple: "/dapo.png",
  },
  openGraph: {
    title: "SIM Dapodik — SMKN 1 Palopo",
    description: "Aplikasi pengelolaan data siswa & GTK terintegrasi Google Sheets.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIM Dapodik — SMKN 1 Palopo",
    description: "Aplikasi pengelolaan data siswa & GTK terintegrasi Google Sheets.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
