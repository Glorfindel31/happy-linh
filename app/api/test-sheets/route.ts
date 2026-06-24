import { NextResponse } from "next/server";

export async function GET() {
    try {
        const sheetId = process.env.GOOGLE_SHEET_ID;
        const email = process.env.GOOGLE_CLIENT_EMAIL;
        const key = process.env.GOOGLE_PRIVATE_KEY?.substring(0, 50) + "...";

        if (!sheetId || !email || !key) {
            return NextResponse.json(
                { error: "Missing env vars" },
                { status: 500 },
            );
        }

        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:formatted?key=${process.env.GOOGLE_API_KEY || ""}`,
            { headers: {} },
        );

        if (!response.ok) {
            const errText = await response.text();
            return NextResponse.json({ error: errText }, { status: 500 });
        }

        const data = await response.json();
        const values = data.values || [];

        return NextResponse.json({ values });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[TEST] Error:", msg);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
