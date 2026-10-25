import type { Metadata, Viewport } from "next"
import { Creepster } from "next/font/google"

// Letra de terror solo para los títulos
const creepster = Creepster({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-terror",
})

export const metadata: Metadata = {
    title: "Adivina Quién: Halloween | Lunar Rojo",
    description: "Adivina Quién para dos con personajes de terror de películas, series, caricaturas y La casita del horror.",
    alternates: {
        canonical: "/adivina-quien",
    },
    openGraph: {
        title: "Adivina Quién: Halloween",
        description: "¿Quién es tu personaje secreto? Juega con alguien más desde su cel.",
        url: "https://lunar-rojo.vercel.app/adivina-quien",
    },
}

export const viewport: Viewport = {
    themeColor: "#0d0714",
}

export default function AdivinaQuienLayout({ children }: { children: React.ReactNode }) {
    return <div className={creepster.variable}>{children}</div>
}
