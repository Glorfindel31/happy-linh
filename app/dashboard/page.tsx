"use client";

// ponytail: debug logging for state machine
import { useEffect, useState } from "react";

type AppState = {
    remaining: number;
    lastReadQuote: string | null;
    nextUnreadRow: number | null;
    firstUnreadQuote: string | null; // text of oldest unread quote for initial display
};

export default function DashboardPage() {
    console.log("[Dashboard] === MOUNTING DASHBOARD ===");

    const [state, setState] = useState<AppState | null>(null);
    const [phase, setPhase] = useState<"ready" | "typing" | "done">("ready");
    const [displayText, setDisplayText] = useState("");
    const [typedText, setTypedText] = useState("");
    const [remaining, setRemaining] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // ponytail: fetch state on mount - FIXED to always run on initial render
    useEffect(() => {
        console.log("[Dashboard:useEffect(mount)] Running fetch on mount");
        fetchState();
    }, []);

    async function fetchState() {
        console.log("[Dashboard:fetchState] Fetching state from /api/quotes");
        try {
            const res = await fetch("/api/quotes");
            console.log(
                `[Dashboard:fetchState] Response status: ${res.status}`,
            );
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            const data = await res.json();
            console.log(
                "[Dashboard:fetchState] Received - Full State Object",
                JSON.stringify(data, null, 2),
            );
            setState(data);
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error("[Dashboard:fetchState] Error:", e.message);
                setError(e.message);
            } else {
                console.error("[Dashboard:fetchState] Unknown error:", e);
                setError(String(e));
            }
        }
    }

    // ponytail: logic when state updates - handles display immediately
    useEffect(() => {
        if (!state) return;

        console.log(
            "[Dashboard:useEffect(state)] State changed, current:",
            JSON.stringify(state, null, 2),
        );

        // FIRST check: are there unread quotes? Show the oldest unread one.
        // This takes priority over lastReadQuote - we always want to show fresh content.
        if (state.remaining > 0 && state.firstUnreadQuote !== null) {
            console.log(
                "[Dashboard:useEffect(state)] Showing first UNREAD quote with typewriter",
            );
            setDisplayText(state.firstUnreadQuote);
            setPhase("typing");
            setRemaining(state.remaining);
            return;
        }

        // SECOND check: is there a previously read quote? Show it fully.
        if (state.lastReadQuote !== null) {
            console.log(
                "[Dashboard:useEffect(state)] Showing last READ quote (phase=done)",
            );
            setDisplayText(state.lastReadQuote);
            setPhase("done");
            setRemaining(state.remaining);
            return;
        }

        // THIRD check: all quotes read?
        console.log("[Dashboard:useEffect(state)] All quotes read");
        setDisplayText("All quotes have been read.");
        setPhase("done");
    }, [state]);

    useEffect(() => {
        if (phase !== "typing") return;
        let i = 0;
        const id = setInterval(() => {
            console.log(
                `[Dashboard:typewriter] ${typedText.length}/${displayText.length}: "${typedText.slice(-3)}..."`,
            );
            setTypedText(displayText.slice(0, ++i));
            if (i >= displayText.length) {
                clearInterval(id);
                setPhase("done");
                console.log("[Dashboard:typewriter] Finished typing");
            }
        }, 35);
        return () => clearInterval(id);
    }, [phase, displayText]);

    async function handleNext() {
        console.log(
            "[Dashboard:handleNext] Clicked Next",
            JSON.stringify(state, null, 2),
        );

        setError(null);
        if (!state || state.remaining === 0) {
            console.log("[Dashboard:handleNext] No unread quotes to show");
            return;
        }

        // Fire and forget POST request - it marks current oldest as read and returns new state
        console.log(
            "[Dashboard:handleNext] Calling /api/quotes POST",
            JSON.stringify({ row: state.nextUnreadRow }),
        );
        const res = await fetch("/api/quotes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ row: state.nextUnreadRow }),
        });

        console.log("[Dashboard:handleNext] POST response received");
        console.log(
            `[Dashboard:handleNext] POST status: ${res.status}`,
            JSON.stringify({ ok: res.ok }),
        );
        if (!res.ok) {
            console.error(
                "[Dashboard:handleNext] POST failed:",
                await res.text(),
            );
        }
        const nextState = await res.json();
        console.log(
            "[Dashboard:handleNext] New state - Full State Object",
            JSON.stringify(nextState, null, 2),
        );

        // Update state with fresh data (includes new firstUnreadQuote for next quote)
        setState(nextState);
    }

    const title = !state ? "happy-linh" : `${remaining} remaining`;

    const allDone = !state || state.remaining === 0;

    if (error) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
                <div className="w-full px-6 py-4 text-sm font-medium text-[#1A1A1A]">
                    {title}
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="text-xl">
                            Could not load quotes. Try again.
                        </div>
                        <button
                            onClick={fetchState}
                            className="px-6 py-3 bg-[#C9796A] hover:bg-[#b86a5a] transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
            <div className="w-full px-6 py-4 text-sm font-medium text-[#1A1A1A]">
                {title}
            </div>
            <div className="flex-1 flex items-center justify-center p-6 text-[#1A1A1A]">
                <div className="max-w-2xl text-center space-y-8">
                    {/* ponytail: show only quote or all done message - no "Ready to start" */}
                    {!allDone && (
                        <div
                            className={`font-serif ${
                                phase === "typing"
                                    ? ""
                                    : "transition-opacity duration-300"
                            }`}
                        >
                            {" "}
                            {typedText}
                            {phase === "typing" && (
                                <span className="inline-block w-0.5 h-6 bg-[#C9796A] ml-1 animate-pulse"></span>
                            )}
                        </div>
                    )}

                    {!allDone && (
                        <button
                            onClick={handleNext}
                            disabled={phase === "typing"}
                            className="px-8 py-4 text-xl font-medium bg-[#C9796A] hover:bg-[#b86a5a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    )}

                    {allDone && (
                        <div className="text-xl font-medium">All done. ✓</div>
                    )}
                </div>
            </div>
        </div>
    );
}
