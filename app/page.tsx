"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if ((document.cookie || "").includes("session=authenticated")) {
            router.push("/dashboard");
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "login", username, password }),
        });

        if (res.ok) {
            router.push("/dashboard");
        } else {
            setError("Wrong credentials.");
        }
    };

    return (
        <div className="min-h-screen bg-pink-100 flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white rounded-3xl border border-pink-200 p-8 shadow-sm">
                <h1 className="font-typewriter text-2xl text-pink-700 text-center tracking-wide mb-8">
                    Welcome to Your happy place
                </h1>

                <form className="space-y-4">
                    <label className="block text-xs font-medium text-pink-600 uppercase tracking-wide mb-1">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                        placeholder="Username"
                    />

                    <label className="block text-xs font-medium text-pink-600 uppercase tracking-wide mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                        placeholder="Password"
                    />

                    <button
                        type="submit"
                        onClick={handleLogin}
                        className="w-full bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white font-medium rounded-full py-3 text-sm tracking-wide transition-colors duration-150"
                    >
                        Enter
                    </button>

                    {error && (
                        <div className="text-center text-sm text-rose-500 mt-3">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
