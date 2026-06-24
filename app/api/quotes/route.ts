import { NextRequest, NextResponse } from "next/server";
import { getState, markRead } from "../../../lib/sheets";

export async function GET() {
    try {
        const state = await getState();

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
        return NextResponse.json(
            { error: "Could not load quotes", raw: msg },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const row = body.row;

        if (!row || !Number.isInteger(row)) {
            return NextResponse.json({ error: "Invalid row" }, { status: 400 });
        }

        await markRead(row);

        const state = await getState();

        // Return the new state with fresh cache headers
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
        return NextResponse.json(
            { error: "Could not mark read", raw: msg },
            { status: 500 },
        );
    }
}
