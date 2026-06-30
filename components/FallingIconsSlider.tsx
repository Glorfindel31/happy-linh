"use client";

import { Slider } from "@/components/ui/slider";
import { useFallingIconsCount } from "@/components/FallingIconsShell";

export function FallingIconsSlider() {
    const { count, setCount } = useFallingIconsCount();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex w-40 flex-col items-end gap-1.5">
            <span className="text-xs text-pink-400 font-medium tabular-nums">
                {count} Kitties
            </span>
            <Slider
                min={20}
                max={300}
                step={1}
                value={count}
                onValueChange={(val) => setCount(val as number)}
            />
        </div>
    );
}
