import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forge · PC Build Optimizer",
  description: "Configuratore intelligente di PC per il mercato italiano.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
