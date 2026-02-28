import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WikiAgent - AI-Powered Wikipedia Assistant",
  description: "Factual answers powered by Wikipedia and GenAI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}