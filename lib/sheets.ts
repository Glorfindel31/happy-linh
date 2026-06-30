import { google } from "googleapis";

// ponytail: uses GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY env vars
// Upgrade path: wrap in cache if latency becomes an issue.

export async function getQuotes(): Promise<
    { text: string; row: number; isRead: boolean }[]
> {
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

        const rawValues = response.data.values || [];

        const rows = rawValues.map((rowVal, i) => {
            const text = rowVal[0] ?? "";
            const isRead = !!rowVal[1];
            return { text, row: i + 1, isRead };
        });

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
            values: [
                [
                    new Date().toLocaleString("en-US", {
                        timeZone: "Asia/Ho_Chi_Minh",
                    }),
                ],
            ],
        },
    });
}

export async function logVisit(): Promise<{ showWelcome: boolean }> {
    const auth = await google.auth.getClient({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL!,
            private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID!,
        range: "Sheet1!D1",
    });
    const raw: string = res.data.values?.[0]?.[0] ?? "";

    const now = new Date();
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;

    let shouldWrite = true;

    if (raw) {
        const last = new Date(raw);
        if (!isNaN(last.getTime()) && now.getTime() - last.getTime() < TWELVE_HOURS) {
            shouldWrite = false;
        }
    }

    // toast only on a real return visit: there was a previous timestamp and it's now stale (>12h)
    const showWelcome = shouldWrite && !!raw;

    if (shouldWrite) {
        const hanoiTime = new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString();
        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID!,
            range: "Sheet1!D1",
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [[hanoiTime]] },
        });
    }

    return { showWelcome };
}

export async function getState(): Promise<{
    remaining: number;
    lastReadQuote: string | null;
    nextUnreadRow: number | null;
    firstUnreadQuote: string | null;
}> {
    const rows = await getQuotes();
    const unreadRows = rows.filter((r) => !r.isRead);
    const lastReadIndex = rows.findIndex((r) => r.isRead);

    return {
        remaining: unreadRows.length,
        lastReadQuote: lastReadIndex >= 0 ? rows[lastReadIndex].text : null,
        nextUnreadRow: unreadRows.length > 0 ? unreadRows[0].row : null,
        firstUnreadQuote: unreadRows.length > 0 ? unreadRows[0].text : null,
    };
}
