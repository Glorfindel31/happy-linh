import { NextResponse } from "next/server";
import { logVisit } from "../../../lib/sheets";

export async function POST() {
    try {
        const result = await logVisit();
        return NextResponse.json(result, {
            headers: { "Cache-Control": "no-store" },
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
