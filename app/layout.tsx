import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
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
    <html lang="en">
      <body className="antialiased bg-bg-primary min-h-screen">
        <AppProvider>
          <Navigation />
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
