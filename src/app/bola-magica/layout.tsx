import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Bola Mágica | Lunar Rojo",
    description: "Hazle una pregunta a la bola mágica.",
    alternates: {
        canonical: "/bola-magica",
    },
}

export default function BolaMagicaLayout({ children }: { children: React.ReactNode }) {
    return children
}
