import { NextResponse } from "next/server";

export async function GET() {
    console.log("[TEST] === /api/test-sheets called ===");

    try {
        const sheetId = process.env.GOOGLE_SHEET_ID;
        const email = process.env.GOOGLE_CLIENT_EMAIL;
        const key = process.env.GOOGLE_PRIVATE_KEY?.substring(0, 50) + "...";

        console.log("[TEST] Sheet ID:", sheetId);
        console.log("[TEST] Email:", email);
        console.log("[TEST] Key preview:", key);

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

        console.log("[TEST] API response status:", response.status);

        if (!response.ok) {
            const errText = await response.text();
            return NextResponse.json({ error: errText }, { status: 500 });
        }

        const data = await response.json();
        console.log("[TEST] Raw API response:", JSON.stringify(data, null, 2));

        const values = data.values || [];
        console.log("[TEST] Rows count:", values.length);
        console.log(
            "[TEST] First row preview:",
            JSON.stringify(values[0]?.slice(0, 3), null, 2),
        );

        return NextResponse.json({ values });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[TEST] Error:", msg);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
