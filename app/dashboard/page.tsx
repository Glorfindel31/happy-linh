"use client";

import { useEffect, useState } from "react";

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
    }, []);

    async function fetchState() {
        try {
            const res = await fetch("/api/quotes");
            if (!res.ok)
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            const data: AppState = await res.json();
            setState(data);
            if (data.firstUnreadQuote) {
                // First open or returning: show the next unread quote fully, no typewriter.
                // User triggers the typewriter by clicking Next (which marks this row).
                setTypedText(data.firstUnreadQuote);
                setPhase("done");
            }
            // If firstUnreadQuote is null, remaining === 0 → allDone renders instead.
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
    }
    // ponytail: derive displayText from state directly in render phase
    const displayText = (() => {
        if (!state) return "";

        if (state.remaining > 0 && state.firstUnreadQuote !== null) {
            return state.firstUnreadQuote;
        }

        if (state.lastReadQuote !== null) {
            return state.lastReadQuote;
        }

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
        if (!state || state.remaining === 0) {
            return;
        }

        const res = await fetch("/api/quotes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ row: state.nextUnreadRow }),
        });

        if (!res.ok) {
            console.error(
                "[Dashboard:handleNext] POST failed:",
                await res.text(),
            );
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
                <h2 className="font-typewriter text-xl text-pink-700">
                    {error}
                </h2>
                <button
                    onClick={fetchState}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-full px-8 py-3 transition-colors duration-150"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center px-4 py-8 gap-4">
            {!allDone && (
                <div className="bg-pink-200 text-pink-800 text-xs font-medium rounded-full px-4 py-1.5 tracking-wide whitespace-nowrap">
                    {state?.remaining} quotes left
                </div>
            )}

            {!allDone && (
                <div className="w-full max-w-sm bg-white rounded-3xl border border-pink-200 p-8 shadow-sm flex flex-col items-center gap-4">
                    <div className="text-xl font-typewriter leading-relaxed text-stone-800 text-center min-h-30 flex items-center justify-center">
                        {typedText}
                        {phase === "typing" && (
                            <span
                                className="inline-block w-0.5 h-[1.1em] bg-pink-400 ml-0.5 align-middle animate-pulse"
                                aria-hidden="true"
                            />
                        )}
                    </div>

                    {!allDone && (
                        <button
                            onClick={handleNext}
                            disabled={
                                !state ||
                                phase === "typing" ||
                                state.remaining === 0
                            }
                            className="bg-pink-500 hover:bg-pink-600 active:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-full px-10 py-3 text-sm tracking-wide transition-colors duration-150"
                        >
                            Next
                        </button>
                    )}
                </div>
            )}

            {allDone && (
                <div className="bg-pink-200 text-pink-800 font-medium rounded-full px-6 py-3 tracking-wide">
                    all done ✓
                </div>
            )}
        </div>
    );
}
