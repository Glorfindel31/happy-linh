"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

function Slider({
    className,
    ...props
}: SliderPrimitive.Root.Props) {
    return (
        <SliderPrimitive.Root
            className={cn("flex w-full touch-none flex-col gap-2", className)}
            {...props}
        >
            <SliderPrimitive.Control className="flex w-full items-center py-1">
                <SliderPrimitive.Track className="relative h-1.5 w-full grow rounded-full bg-pink-200">
                    <SliderPrimitive.Indicator className="absolute h-full rounded-full bg-pink-400" />
                    <SliderPrimitive.Thumb className="block size-4 rounded-full bg-pink-500 shadow-[0_2px_8px_color-mix(in_oklch,var(--color-pink-400)_40%,transparent)] outline-none transition-shadow focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-pink-300)_50%,transparent)] hover:bg-pink-600" />
                </SliderPrimitive.Track>
            </SliderPrimitive.Control>
        </SliderPrimitive.Root>
    );
}

export { Slider };
