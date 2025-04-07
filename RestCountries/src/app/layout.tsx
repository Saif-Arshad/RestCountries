import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RestCountries API - Countries API For Your Next Project  ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body >
        {children}
        </body>
    </html>
  );
}
