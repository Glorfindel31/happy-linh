"use client";

import { createContext, useContext, useState } from "react";
import FallingIcons from "@/lib/fallingIcones";

type FallingIconsCountCtx = {
    count: number;
    setCount: (n: number) => void;
};

const FallingIconsCountContext = createContext<FallingIconsCountCtx>({
    count: 30,
    setCount: () => {},
});

export function useFallingIconsCount() {
    return useContext(FallingIconsCountContext);
}

export function FallingIconsShell({
    icons,
    children,
}: {
    icons: string[];
    children: React.ReactNode;
}) {
    const [count, setCount] = useState(30);

    return (
        <FallingIconsCountContext.Provider value={{ count, setCount }}>
            <FallingIcons icons={icons} count={count} />
            {children}
        </FallingIconsCountContext.Provider>
    );
}
