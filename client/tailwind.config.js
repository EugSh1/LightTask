/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "#0e121d",
                surface: {
                    DEFAULT: "#181a24",
                    bright: "#20242f"
                },
                primary: "#6C64E3",
                text: {
                    DEFAULT: "#ffffff",
                    dimmed: "#b8bcc5"
                },
                border: "#363c46"
            }
        }
    },
    plugins: []
};
