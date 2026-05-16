import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AnimatedNav } from "@/components/ui/navigation-menu";
import { GlobalGrid } from "@/components/ui/global-grid";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tran Chi Hieu — BI Developer & Data Analyst",
  description:
    "Portfolio of Tran Chi Hieu — BI Developer and Data Analyst with 6+ years of experience in Power BI, data modeling, and analytics engineering.",
  openGraph: {
    title: "Tran Chi Hieu — BI Developer & Data Analyst",
    description:
      "Portfolio showcasing BI and data analytics projects, skills, and certifications.",
    type: "website",
  },
};

const navItems = [
  { name: "Portfolio", href: "/" },
  { name: "Saved Places", href: "/places" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-background text-foreground">
        <GlobalGrid />
<AnimatedNav items={navItems} />
        {children}
      </body>
    </html>
  );
}
