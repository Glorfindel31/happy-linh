import type { Metadata } from "next";
import { Special_Elite } from "next/font/google";
import FallingIcons from "@/lib/fallingIcones";
import k1 from "../public/1.svg";
import k2 from "../public/2.svg";
import k3 from "../public/3.svg";
import k4 from "../public/4.svg";
import k5 from "../public/5.svg";
import k6 from "../public/6.svg";
import k7 from "../public/7.svg";
import k8 from "../public/8.svg";
import k9 from "../public/9.svg";
import k10 from "../public/10.svg";
import k11 from "../public/11.svg";
import k12 from "../public/12.svg";
import k13 from "../public/13.svg";
import k14 from "../public/14.svg";

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
                <FallingIcons
                    icons={[
                        k1.src,
                        k2.src,
                        k3.src,
                        k4.src,
                        k5.src,
                        k6.src,
                        k7.src,
                        k8.src,
                        k9.src,
                        k10.src,
                        k11.src,
                        k12.src,
                        k13.src,
                        k14.src,
                    ]}
                    count={70}
                />
                {children}
            </body>
        </html>
    );
}
