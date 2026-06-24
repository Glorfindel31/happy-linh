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
    // ponytail: derive these from state directly in render phase - no setState in effect
    const remaining = state?.remaining ?? 0;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchState();
    }, []);

    async function fetchState() {
        try {
            const res = await fetch("/api/quotes");
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            const data = await res.json();
            setState(data);
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(String(e));
            }
        }
    }

    // ponytail: derive displayText from state directly in render phase, not in effect
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
    }

    const title = !state ? "happy-linh" : `${remaining} remaining`;

    const allDone = !state || state.remaining === 0;

    if (error) {
        return (
            <div>
                <p>{title}</p>
                <div className="text-center space-y-4">
                    <div>Could not load quotes. Try again.</div>
                    <button onClick={fetchState}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1>{title}</h1>
            <div className="space-y-4">
                {!allDone && (
                    <div>
                        {typedText}
                        {phase === "typing" && <span></span>}
                    </div>
                )}

                {!allDone && (
                    <button onClick={handleNext} disabled={phase === "typing"}>
                        Next
                    </button>
                )}

                {allDone && <p>All done.</p>}
            </div>
        </div>
    );
}
