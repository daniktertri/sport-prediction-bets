import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Sports Prediction Game",
  description: "Predict match results and compete for points",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-bg-primary min-h-screen">
        <AppProvider>
          <LanguageProvider>
            <Navigation />
            <main className="pb-20 md:pb-0">{children}</main>
          </LanguageProvider>
        </AppProvider>
      </body>
    </html>
  );
}
