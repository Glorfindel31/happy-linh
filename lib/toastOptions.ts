import { toast } from "sonner";
import type { ExternalToast } from "sonner";

const toastOptions: ExternalToast = {
    duration: 12000,
    style: {
        background: "var(--primary)",
        color: "var(--primary-foreground)",
        border: "none",
        boxShadow: "var(--shadow-kawaii)",
        fontSize: "1.05rem",
        fontWeight: "500",
        padding: "1.25rem 1.75rem",
        borderRadius: "var(--radius)",
    },
};

const WELCOME_MESSAGE = "welcome back 🌸 something is new, look arround!";

export function showWelcomeToast() {
    toast(WELCOME_MESSAGE, toastOptions);
}
