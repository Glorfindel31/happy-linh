import { google } from "googleapis";

// ponytail: uses GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY env vars
// Upgrade path: wrap in cache if latency becomes an issue.

export async function getQuotes(): Promise<
    { text: string; row: number; isRead: boolean }[]
> {
    // SINGLE LOG - check if anything appears in terminal
    console.log("[sheets:getQuotes] === STARTING FUNCTION ===");
    console.log(
        "[sheets:getQuotes] GOOGLE_CLIENT_EMAIL:",
        process.env.GOOGLE_CLIENT_EMAIL,
    );

    try {
        const auth = await google.auth.getClient({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL!,
                private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(
                    /\\n/g,
                    "\n",
                ),
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID!,
            range: "Sheet1!A:B",
        });

        console.log(
            "[sheets:getQuotes] Response.data:",
            JSON.stringify(response.data, null, 2),
        );

        const rawValues = response.data.values || [];

        const rows = rawValues.map((rowVal, i) => {
            const text = rowVal[0] ?? "";
            const isRead = !!rowVal[1];
            return { text, row: i + 1, isRead };
        });

        console.log("[sheets:getQuotes] === RETURNING ROWS ===");
        return rows;
    } catch (e) {
        if (e instanceof Error) {
            console.error("[sheets:getQuotes] Error:", e.message);
        } else {
            console.error("[sheets:getQuotes] Unknown error:", e);
        }
        throw e;
    }
}

export async function markRead(row: number): Promise<void> {
    console.log(`[markRead] Marking row ${row} as read`);

    const auth = await google.auth.getClient({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL!,
            private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID!,
        range: `Sheet1!B${row}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [[new Date().toISOString()]],
        },
    });
}

export async function getState(): Promise<{
    remaining: number;
    lastReadQuote: string | null;
    nextUnreadRow: number | null;
    firstUnreadQuote: string | null;
}> {
    console.log("[getState] Calling getQuotes()");

    const rows = await getQuotes();

    const unreadRows = rows.filter((r) => !r.isRead);
    const lastReadIndex = rows.findIndex((r) => r.isRead);

    console.log(
        "[getState] === RETURNING STATE ===",
        JSON.stringify(
            {
                remaining: unreadRows.length,
                lastReadQuote:
                    lastReadIndex >= 0 ? rows[lastReadIndex].text : null,
                nextUnreadRow: unreadRows.length > 0 ? unreadRows[0].row : null,
                firstUnreadQuote:
                    unreadRows.length > 0 ? unreadRows[0].text : null,
            },
            null,
            2,
        ),
    );

    return {
        remaining: unreadRows.length,
        lastReadQuote: lastReadIndex >= 0 ? rows[lastReadIndex].text : null,
        nextUnreadRow: unreadRows.length > 0 ? unreadRows[0].row : null,
        firstUnreadQuote: unreadRows.length > 0 ? unreadRows[0].text : null,
    };
}
