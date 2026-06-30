/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState, useEffect } from "react";
import style from "../app/fallingIcones.module.css";

type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;
type SvgSrc = string;

interface FallingIconsProps {
    icons: (SvgComponent | SvgSrc)[];
    count?: number;
}

interface Particle {
    id: number;
    icon: SvgComponent | SvgSrc;
    left: number;
    size: number;
    duration: number;
    delay: number;
    sway: number;
    spin: number;
    opacity: number;
}

export default function FallingIcons({
    icons = [],
    count = 28,
}: FallingIconsProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    /* eslint-disable react-hooks/purity */
    const particles = useMemo<Particle[]>(() => {
        return Array.from({ length: count }, (_, i) => {
            const duration = 7 + Math.random() * 9;
            return {
                id: i,
                icon: icons[i % icons.length],
                left: Math.random() * 97,
                size: 22 + Math.random() * 34,
                duration,
                delay: -(Math.random() * duration),
                sway: (Math.random() - 0.5) * 140,
                spin:
                    (Math.random() > 0.5 ? 1 : -1) *
                    (150 + Math.random() * 210),
                opacity: 0.45 + Math.random() * 0.55,
            };
        });
    }, [icons, count]);
    /* eslint-enable react-hooks/purity */

    // Do not render anything until the client has mounted to prevent hydration errors
    if (!isMounted || !icons.length) return null;

    return (
        <div aria-hidden="true" className={style.container}>
            {particles.map((p) => (
                <div
                    key={p.id}
                    className={style.particle}
                    style={
                        {
                            left: `${p.left}vw`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            opacity: p.opacity,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`,
                            "--sway": `${p.sway}px`,
                            "--spin": `${p.spin}deg`,
                        } as React.CSSProperties
                    }
                >
                    {typeof p.icon === "string" ? (
                            <img
                            src={p.icon}
                            width="100%"
                            height="100%"
                            alt=""
                            draggable={false}
                        />
                    ) : (
                        <p.icon width="100%" height="100%" aria-hidden="true" />
                    )}
                </div>
            ))}
        </div>
    );
}
