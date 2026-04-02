import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sociometry",
  description: "Map relationships in your group",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-white [background:radial-gradient(ellipse_at_70%_30%,#0ea5e9_0%,#0369a1_50%,#0c1a2e_100%)] [font-family:'Segoe_UI',system-ui,sans-serif]">
        <div className="min-h-screen flex items-center justify-center p-8 [background:radial-gradient(ellipse_at_70%_30%,#0ea5e9_0%,#0369a1_50%,#0c1a2e_100%)] [font-family:'Segoe_UI',system-ui,sans-serif]">
          {children}
        </div>
      </body>
    </html>
  );
}
