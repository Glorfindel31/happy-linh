import type { Metadata } from "next";
import { Special_Elite } from "next/font/google";
import "./globals.css";

const typewriter = Special_Elite({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-typewriter",
});

export const metadata: Metadata = {
    title: "HAPPY LINH",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={typewriter.variable}>
            <body className="min-h-screen bg-pink-100 font-sans antialiased">
                {children}
            </body>
        </html>
    );
}
