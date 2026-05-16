import type { Metadata } from "next";
import "./globals.css";
import { BlogProvider } from "@/context/BlogContext";

export const metadata: Metadata = {
  title: "ZENI. | Write & Read",
  description: "A minimalist platform to write, publish, and discover stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <BlogProvider>{children}</BlogProvider>
      </body>
    </html>
  );
}
