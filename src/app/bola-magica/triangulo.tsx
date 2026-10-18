import { Barlow_Condensed } from "next/font/google"

const barlow = Barlow_Condensed({ subsets: ["latin"], weight: "600" })

// El triángulo vive en un cuadro de 100 × 100 con su centro en (50, 50),
// así queda centrado dentro de la ventana redonda de la bola.
const PUNTOS = "50,4 89.84,73 10.16,73"
const CENTRO_TEXTO = 52.5

export function Triangulo({ lineas }: { lineas: string[] }) {
    const largoMax = Math.max(...lineas.map((l) => l.length))
    const tamanoBase = lineas.length === 1 ? 15 : lineas.length === 2 ? 9.5 : 8
    // Achica la letra si el renglón más largo no cabe
    const tamano = Math.min(tamanoBase, 112 / largoMax)
    const interlineado = tamano * 1.08
    const primerRenglon = CENTRO_TEXTO - ((lineas.length - 1) * interlineado) / 2

    return (
        <svg viewBox="0 0 100 100" className="block w-full h-full overflow-visible" aria-hidden>
            <defs>
                <linearGradient id="bola-magica-cara" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3753e3" />
                    <stop offset="100%" stopColor="#1a2a94" />
                </linearGradient>
            </defs>
            <polygon
                points={PUNTOS}
                fill="url(#bola-magica-cara)"
                stroke="url(#bola-magica-cara)"
                strokeWidth={5}
                strokeLinejoin="round"
            />
            <text
                className={barlow.className}
                textAnchor="middle"
                fill="#e3eaff"
                fontSize={tamano}
                letterSpacing={0.3}
            >
                {lineas.map((linea, i) => (
                    <tspan key={i} x={50} y={primerRenglon + i * interlineado} dominantBaseline="middle">
                        {linea}
                    </tspan>
                ))}
            </text>
        </svg>
    )
}
