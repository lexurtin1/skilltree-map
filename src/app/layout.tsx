import type { Metadata } from "next";
import { Marcellus, Plus_Jakarta_Sans } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "SkillTree · MAP",
  description:
    "Interactive constellation map of AI jobs across business departments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${marcellus.variable} h-full`}
    >
      <body className="h-full overflow-hidden antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
