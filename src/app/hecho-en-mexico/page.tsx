import { Info, ScanBarcode, Tag } from "lucide-react"
import clsx from "clsx"
import { Buscador } from "./buscador"
import { CATEGORIAS, FECHA_REVISION, MARCAS, type Nivel } from "./datos"
import { NIVELES } from "./niveles"

const CONSEJOS = [
    {
        icono: Tag,
        titulo: "Voltea el producto",
        texto: "La etiqueta dice quién lo fabrica o quién lo importa. Si dice «Importado por», no se hizo en México.",
    },
    {
        icono: ScanBarcode,
        titulo: "¿El código empieza con 750?",
        texto: "Se registró en México. Es una pista, no una prueba: muchas empresas extranjeras que fabrican aquí también usan 750.",
    },
    {
        icono: Info,
        titulo: "Las marcas cambian de dueño",
        texto: `Revisamos estos datos en ${FECHA_REVISION}. Si algo no cuadra, confía en la etiqueta.`,
    },
]

export default function HechoEnMexico() {
    return (
        <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:pt-16">
            <div className="mx-auto max-w-2xl">
                <header>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-red-400">Lunar Rojo · Compra mexicano</p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">¿Es mexicano?</h1>
                    <p className="mt-3 text-lg leading-relaxed text-white/70">
                        Escribe lo que buscas o una marca y te decimos cuáles son de empresas mexicanas.
                    </p>

                    <ul className="mt-6 grid gap-2.5 rounded-2xl border border-white/10 p-4" aria-label="Cómo leer el semáforo">
                        {(Object.keys(NIVELES) as Nivel[]).map((nivel) => (
                            <li key={nivel} className="flex items-start gap-3">
                                <span className={clsx("mt-1.5 size-2.5 shrink-0 rounded-full", NIVELES[nivel].punto)} aria-hidden />
                                <p className="text-sm leading-relaxed text-white/60">
                                    <strong className="font-semibold text-white">{NIVELES[nivel].etiqueta}:</strong>{" "}
                                    {NIVELES[nivel].descripcion}
                                </p>
                            </li>
                        ))}
                    </ul>
                </header>

                <div className="mt-6">
                    <Buscador />
                </div>

                <section aria-labelledby="titulo-consejos" className="mt-16">
                    <h2 id="titulo-consejos" className="text-xl font-semibold text-white">
                        En el súper
                    </h2>
                    <ul className="mt-4 grid gap-3">
                        {CONSEJOS.map(({ icono: Icono, titulo, texto }) => (
                            <li key={titulo} className="flex gap-4 rounded-2xl border border-white/10 p-4">
                                <Icono className="mt-0.5 size-5 shrink-0 text-red-400" aria-hidden />
                                <div>
                                    <p className="font-medium text-white">{titulo}</p>
                                    <p className="mt-1 text-sm leading-relaxed text-white/60">{texto}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-white/40">
                    {MARCAS.length} marcas en {CATEGORIAS.length} categorías · Revisado en {FECHA_REVISION}
                </footer>
            </div>
        </main>
    )
}
