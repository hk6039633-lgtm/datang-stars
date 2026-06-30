import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavHeader from "./components/NavHeader";

const baseUrl = "https://tangju.vkcube.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "唐局",
    template: "%s | 唐局",
  },
  description: "一张图看懂大唐三百年人物、权力与风云",
  keywords: ["唐朝", "大唐", "历史人物", "关系图谱", "人物年表", "唐局"],
  authors: [{ name: "唐局" }],
  openGraph: {
    title: "唐局",
    description: "一张图看懂大唐三百年人物、权力与风云",
    siteName: "唐局",
    locale: "zh_CN",
    type: "website",
    images: [{
      url: "/wechat-share.jpg",
      width: 300,
      height: 300,
      alt: "唐局 - 一张图看懂大唐三百年人物、权力与风云",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "唐局",
    description: "一张图看懂大唐三百年人物、权力与风云",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fdfbf7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#fdfbf7]">
        <NavHeader />
        {children}
      </body>
    </html>
  );
}
