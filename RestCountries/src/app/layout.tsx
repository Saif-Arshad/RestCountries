import type { Metadata } from "next";
import "./globals.css";
import { AOSProvider } from "@/components/aos";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "RestCountries API - Countries API For Your Next Project  ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning >
      <body >
        <AOSProvider session={session} >
          {children}
        </AOSProvider>
      </body>
    </html>
  );
}
