import type { Metadata } from "next";
import "./globals.css";
import { BlogProvider } from "@/context/BlogContext";
import { VectorBackground } from "@/components/VectorBackground";

export const metadata: Metadata = {
  title: "NextZeni | Write & Read",
  description: "A minimalist platform to write, publish, and discover stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased relative">
        <VectorBackground />
        <div className="relative" style={{ zIndex: 1 }}>
          <BlogProvider>{children}</BlogProvider>
        </div>
      </body>
    </html>
  );
}
