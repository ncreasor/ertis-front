import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "Ertis Service - Сообщайте о проблемах",
  description: "Сервис для сообщения о городских проблемах в Павлодаре",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-screen bg-background kazakh-pattern">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
