import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { SubjectSelectionProvider } from "@/context/SubjectSelectionContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Handbook | Master Nigerian Excellence",
};

export default function RootLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="antialiased selection:bg-indigo-100 selection:text-indigo-900">
        <SubjectSelectionProvider>
          {children}
        </SubjectSelectionProvider>
      </body>
    </html>
  );
}


