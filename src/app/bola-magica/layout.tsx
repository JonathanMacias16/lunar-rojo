import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
    title: "Bola Mágica | Lunar Rojo",
    description: "Hazle una pregunta a la bola mágica.",
    alternates: {
        canonical: "/bola-magica",
    },
    // Para que al agregarla al cel se abra directo en la bola, con su propio ícono
    manifest: "/bola-magica.webmanifest",
    applicationName: "Bola Mágica",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black",
        title: "Bola Mágica",
    },
    icons: {
        icon: [{ url: "/bola-magica-icono-192.png", sizes: "192x192", type: "image/png" }],
        apple: "/bola-magica-apple-touch-icon.png",
    },
}

export const viewport: Viewport = {
    themeColor: "#0a0a0a",
}

export default function BolaMagicaLayout({ children }: { children: React.ReactNode }) {
    return children
}
