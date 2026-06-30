"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { showWelcomeToast } from "@/lib/toastOptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FallingIconsSlider } from "@/components/FallingIconsSlider";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/visit", { method: "POST" })
            .then((r) => r.json())
            .then((data) => {
                if (data.showWelcome) {
                    showWelcomeToast();
                }
            })
            .catch(() => {});

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
            <FallingIconsSlider />
            <Card className="w-full max-w-sm shadow-sm">
                <CardHeader>
                    <CardTitle className="font-typewriter text-2xl text-pink-700 text-center tracking-wide">
                        Welcome to Your happy place
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="username" className="text-pink-600 uppercase tracking-wide text-xs">
                                Username
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="bg-pink-50"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-pink-600 uppercase tracking-wide text-xs">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="bg-pink-50"
                            />
                        </div>

                        <Button type="submit" className="w-full rounded-full">
                            Enter
                        </Button>

                        {error && (
                            <p className="text-center text-sm text-rose-500">{error}</p>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
