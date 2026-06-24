import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { action, username, password } = body;

    if (action === "login") {
        if (
            username === process.env.APP_USER &&
            password === process.env.APP_PASSWORD
        ) {
            const response = NextResponse.json({ ok: true });
            response.cookies.set("session", "authenticated", {
                httpOnly: true,
                path: "/",
                sameSite: "lax" as const,
            });
            return response;
        }
        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 },
        );
    }

    if (action === "logout") {
        const response = NextResponse.json({ ok: true });
        response.cookies.set("session", "", {
            expires: new Date(0),
            httpOnly: true,
            path: "/",
            sameSite: "lax" as const,
        });
        return response;
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
