/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                // This links Tailwind class "font-typewriter" to your Next.js CSS variable
                typewriter: ["var(--font-typewriter)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
