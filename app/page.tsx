"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Add console.logs everywhere for debuging

export default function LoginPage() {
    const router = useRouter();

    // Redirect if already authenticated
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
        <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6 text-[#1A1A1A]">
                <div className="text-2xl font-bold text-center mb-8">
                    happy-linh
                </div>

                <div
                    className="space-y-4"
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
                    <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        className="w-full p-4 text-lg border-none outline-none focus:ring-0 bg-transparent placeholder:text-gray-500"
                        style={{ color: "#1A1A1A" }}
                    />
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        className="w-full p-4 text-lg border-none outline-none focus:ring-0 bg-transparent placeholder:text-gray-500"
                        style={{ color: "#1A1A1A" }}
                    />
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
                        className="w-full p-6 text-2xl font-medium bg-[#C9796A] hover:bg-[#b86a5a] active:bg-[#a05a4e] transition-colors"
                    >
                        Enter
                    </button>
                </div>
            </div>
        </div>
    );
}
