import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Udaipur Reads",
  description: "Our favorites",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {children}
        <footer className="h-12 bg-slate-50 text-slate-800 flex-none text-center">
          <div className="my-2">
            Developed by{" "}
            <span className=" border-b-2 border-blue-500 hover:border-b-4 hover:cursor-pointer">
              <Link href="https://logan1x.github.io" target="_blank">
                Khushal
              </Link>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
