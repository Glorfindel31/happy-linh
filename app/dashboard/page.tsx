"use client";

import { useEffect, useState } from "react";
import { showWelcomeToast } from "@/lib/toastOptions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FallingIconsSlider } from "@/components/FallingIconsSlider";

type AppState = {
    remaining: number;
    lastReadQuote: string | null;
    nextUnreadRow: number | null;
    firstUnreadQuote: string | null;
};

export default function DashboardPage() {
    const [state, setState] = useState<AppState | null>(null);
    const [phase, setPhase] = useState<"ready" | "typing" | "done">("ready");
    const [typedText, setTypedText] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchState();
        fetch("/api/visit", { method: "POST" })
            .then((r) => r.json())
            .then((data) => {
                if (data.showWelcome) {
                    showWelcomeToast();
                }
            })
            .catch(() => {});
    }, []);

    async function fetchState() {
        try {
            const res = await fetch("/api/quotes");
            if (!res.ok)
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            const data: AppState = await res.json();
            setState(data);
            if (data.firstUnreadQuote) {
                setTypedText(data.firstUnreadQuote);
                setPhase("done");
            }
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
    }

    // ponytail: derive displayText from state directly in render phase
    const displayText = (() => {
        if (!state) return "";
        if (state.remaining > 0 && state.firstUnreadQuote !== null) return state.firstUnreadQuote;
        if (state.lastReadQuote !== null) return state.lastReadQuote;
        return "All quotes have been read.";
    })();

    useEffect(() => {
        if (phase !== "typing") return;
        let i = 0;
        const id = setInterval(() => {
            setTypedText(displayText.slice(0, ++i));
            if (i >= displayText.length) {
                clearInterval(id);
                setPhase("done");
            }
        }, 35);
        return () => clearInterval(id);
    }, [phase, displayText]);

    async function handleNext() {
        setError(null);
        if (!state || state.remaining === 0) return;

        const res = await fetch("/api/quotes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ row: state.nextUnreadRow }),
        });

        if (!res.ok) {
            console.error("[Dashboard:handleNext] POST failed:", await res.text());
        }

        const nextState = await res.json();
        setState(nextState);
        setTypedText("");
        setPhase("typing");
    }

    const allDone = !state || state.remaining === 0;

    if (error) {
        return (
            <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center px-4 py-8 gap-4">
                <h2 className="font-typewriter text-xl text-pink-700">{error}</h2>
                <Button onClick={fetchState} className="rounded-full px-8">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center px-4 py-8 gap-4">
            <FallingIconsSlider />
            {!allDone && (
                <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-xs tracking-wide whitespace-nowrap">
                    {state?.remaining} quotes left
                </Badge>
            )}

            {!allDone && (
                <Card className="w-full max-w-sm shadow-sm">
                    <CardContent className="flex flex-col items-center gap-4 pt-2">
                        <div className="text-xl font-typewriter leading-relaxed text-stone-800 text-center min-h-30 flex items-center justify-center">
                            {typedText}
                            {phase === "typing" && (
                                <span
                                    className="inline-block w-0.5 h-[1.1em] bg-pink-400 ml-0.5 align-middle animate-pulse"
                                    aria-hidden="true"
                                />
                            )}
                        </div>

                        <Button
                            onClick={handleNext}
                            disabled={!state || phase === "typing" || state.remaining === 0}
                            className="rounded-full px-10"
                        >
                            Next
                        </Button>
                    </CardContent>
                </Card>
            )}

            {allDone && (
                <Badge variant="secondary" className="rounded-full px-6 py-3 text-sm tracking-wide">
                    all done ✓
                </Badge>
            )}
        </div>
    );
}
