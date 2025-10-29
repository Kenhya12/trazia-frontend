/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./node_modules/flyonui/dist/js/*.js"
    ],
    plugins: [
        // FlyonUI se carga automáticamente a través del CSS
        // No necesitas require() aquí
    ],
}