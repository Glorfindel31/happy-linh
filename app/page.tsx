"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        if ((document.cookie || "").includes("session=authenticated")) {
            router.push("/dashboard");
        }
    }, [router]);

    const handleLogin = async (
        e: React.FormEvent<HTMLDivElement>,
        username: string,
        password: string,
    ) => {
        e.preventDefault();
        const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "login", username, password }),
        });

        if (res.ok) {
            router.push("/dashboard");
        } else {
            alert("Wrong credentials.");
        }
    };

    return (
        <div className=" bg-blue-100 w-auto">
            <h1>happy-linh</h1>
            <div
                className="bg-pink-600"
                onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName === "BUTTON") {
                        const btn = target.closest("button");
                        if (btn) {
                            const [username, password] = [
                                (
                                    document.getElementById(
                                        "username",
                                    ) as HTMLInputElement
                                ).value,
                                (
                                    document.getElementById(
                                        "password",
                                    ) as HTMLInputElement
                                ).value,
                            ];
                            const event = new Event("submit", {
                                bubbles: true,
                            });
                            handleLogin(
                                event as unknown as React.FormEvent<HTMLDivElement>,
                                username,
                                password,
                            );
                        }
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        const target = e.target as HTMLElement;
                        if (
                            target.tagName === "INPUT" &&
                            target.id === "password"
                        ) {
                            const [username, password] = [
                                (
                                    document.getElementById(
                                        "username",
                                    ) as HTMLInputElement
                                ).value,
                                (
                                    document.getElementById(
                                        "password",
                                    ) as HTMLInputElement
                                ).value,
                            ];
                            const event = new Event("submit", {
                                bubbles: true,
                            });
                            handleLogin(
                                event as unknown as React.FormEvent<HTMLDivElement>,
                                username,
                                password,
                            );
                        }
                    }
                }}
            >
                <input id="username" type="text" placeholder="Username" />
                <input id="password" type="password" placeholder="Password" />
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        const username = (
                            document.getElementById(
                                "username",
                            ) as HTMLInputElement
                        ).value;
                        const password = (
                            document.getElementById(
                                "password",
                            ) as HTMLInputElement
                        ).value;
                        handleLogin(
                            e as unknown as React.FormEvent<HTMLDivElement>,
                            username,
                            password,
                        );
                    }}
                >
                    Enter
                </button>
            </div>
        </div>
    );
}
