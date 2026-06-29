import type { Metadata } from "next";
import "./globals.css";
import { BlogProvider } from "@/context/BlogContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "NextZeni — Read. Write. Grow.",
  description:
    "NextZeni is a platform where curious minds share knowledge, grow an audience, and earn from their expertise. Publish articles, access tools, and discover ideas across technology, finance, science, culture, and more.",
  keywords: ["blog", "writing", "articles", "knowledge", "technology", "finance", "AI"],
  authors: [{ name: "NextZeni" }],
  openGraph: {
    title: "NextZeni — Read. Write. Grow.",
    description: "A platform where people share knowledge, grow audience, and earn from it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-foreground">
        <AuthProvider>
          <BlogProvider>{children}</BlogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
