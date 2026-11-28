import type { Metadata, Viewport } from "next"

const TITULO = "¿Es mexicano?"
const DESCRIPCION = "Busca un producto o una marca y te decimos cuáles son de empresas mexicanas."

export const metadata: Metadata = {
    title: `${TITULO} | Lunar Rojo`,
    description: DESCRIPCION,
    alternates: { canonical: "/hecho-en-mexico" },
    openGraph: { title: TITULO, description: DESCRIPCION, url: "/hecho-en-mexico", type: "website", locale: "es_MX" },
    twitter: { card: "summary", title: TITULO, description: DESCRIPCION },
    // Al agregarla al cel se abre directo aquí, con su propio ícono
    manifest: "/hecho-en-mexico.webmanifest",
    applicationName: TITULO,
    appleWebApp: { capable: true, statusBarStyle: "black", title: TITULO },
    icons: {
        icon: [{ url: "/hecho-en-mexico-icono-192.png", sizes: "192x192", type: "image/png" }],
        apple: "/hecho-en-mexico-apple-touch-icon.png",
    },
}

export const viewport: Viewport = {
    themeColor: "#0a0a0a",
}

export default function HechoEnMexicoLayout({ children }: { children: React.ReactNode }) {
    return children
}
