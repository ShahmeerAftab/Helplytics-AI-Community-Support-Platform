import { Geist } from "next/font/google";
import "./globals.css";

/* ── Google Font: Geist ── */
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Helplytics AI — Community Support Platform",
  description:
    "Get help from real people, share your knowledge, and grow together. The modern community support platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
