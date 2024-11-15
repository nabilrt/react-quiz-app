/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#3B9DF8",
                secondary: "#ffffff",
                border: "#e5eaf2",
                text: "#424242",
                tabTextColor: "#424242",
                shadowColor: "rgba(0, 0, 0, 0.2)",
            },
            fontFamily: {
                manrope: ["Manrope", "sans-serif"],
                inter: ["Inter", "sans-serif"],
                lexend: ["Lexend", "sans-serif"],
            },
        },
    },
    plugins: [],
};
