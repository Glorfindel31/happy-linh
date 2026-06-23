import { NextRequest, NextResponse } from "next/server";
import { getState, markRead } from "../../../lib/sheets";

// ponytail: disable caching for API routes - always return fresh data
export async function GET() {
    console.log("[DEBUG] === /api/quotes GET called ===");

    try {
        console.log("[DEBUG] Calling getState() from lib/sheets.ts");

        const state = await getState();

        console.log(
            "[DEBUG] getState returned:",
            JSON.stringify(state, null, 2),
        );

        // Disable caching headers - always return fresh data
        return NextResponse.json(state, {
            headers: {
                "Cache-Control":
                    "no-store, no-cache, must-revalidate, proxy-revalidate",
                Pragma: "no-cache",
                Expires: "0",
            },
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[DEBUG] GET error:", msg);
        return NextResponse.json(
            { error: "Could not load quotes", raw: msg },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    console.log("[DEBUG] === /api/quotes POST called ===");

    try {
        const body = await request.json();
        console.log("[DEBUG] POST body:", JSON.stringify(body));

        const row = body.row;

        if (!row || !Number.isInteger(row)) {
            return NextResponse.json({ error: "Invalid row" }, { status: 400 });
        }

        // Mark the row as read
        await markRead(row);

        console.log(`[DEBUG] POST marked row ${row} as read`);

        // Re-fetch state
        const state = await getState();

        console.log(
            "[DEBUG] GET new state after marking:",
            JSON.stringify(state, null, 2),
        );

        // Disable caching headers - always return fresh data
        return NextResponse.json(state, {
            headers: {
                "Cache-Control":
                    "no-store, no-cache, must-revalidate, proxy-revalidate",
                Pragma: "no-cache",
                Expires: "0",
            },
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[DEBUG] POST error:", msg);
        return NextResponse.json(
            { error: "Could not mark read", raw: msg },
            { status: 500 },
        );
    }
}
