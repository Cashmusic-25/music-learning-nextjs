import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "🎵 음악 학습 - 높은음/낮은음 구분 연습",
  description: "오선지에서 두 개의 음표 중 더 높은 음을 구분하는 연습을 할 수 있는 인터랙티브한 웹사이트입니다.",
  keywords: ["음악", "학습", "오선지", "음표", "높은음", "낮은음", "음악교육"],
  authors: [{ name: "Music Learning App" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "🎵 음악 학습 - 높은음/낮은음 구분 연습",
    description: "오선지에서 두 개의 음표 중 더 높은 음을 구분하는 연습을 할 수 있는 인터랙티브한 웹사이트입니다.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/abcjs@6.5.1/dist/abcjs-basic-min.js"></script>
      </head>
      <body className="font-inter antialiased">
        {children}
      </body>
    </html>
  );
}
