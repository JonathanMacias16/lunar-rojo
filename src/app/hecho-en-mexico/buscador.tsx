"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import clsx from "clsx"
import {
    Baby,
    Bean,
    Beer,
    Candy,
    ChevronDown,
    Citrus,
    Cookie,
    CupSoda,
    Droplets,
    Flame,
    GlassWater,
    Ham,
    Martini,
    Milk,
    Pill,
    Popcorn,
    Sandwich,
    Search,
    ShowerHead,
    Smile,
    SprayCan,
    WashingMachine,
    Wheat,
    X,
    type LucideIcon,
} from "lucide-react"
import { CATEGORIAS, MARCAS, type Categoria, type IdCategoria, type Marca, type Nivel } from "./datos"
import { alternativasMexicanas, buscar, marcasDeCategoria } from "./busqueda"
import { NIVELES } from "./niveles"

const ICONOS: Record<IdCategoria, LucideIcon> = {
    refrescos: CupSoda,
    agua: GlassWater,
    jugos: Citrus,
    sueros: Droplets,
    cerveza: Beer,
    tequila: Martini,
    pan: Wheat,
    galletas: Cookie,
    botanas: Popcorn,
    dulces: Candy,
    lacteos: Milk,
    carnes: Ham,
    salsas: Flame,
    mayonesa: Sandwich,
    abarrotes: Bean,
    limpieza: SprayCan,
    lavanderia: WashingMachine,
    dental: Smile,
    cuidado: ShowerHead,
    papel: Baby,
    farmacia: Pill,
}

const SUGERENCIAS = ["Refresco", "Pasta de dientes", "Papel de baño", "Botanas", "Detergente", "Cerveza"]

const MEXICANAS_POR_CATEGORIA = Object.fromEntries(
    CATEGORIAS.map((c) => [c.id, MARCAS.filter((m) => m.nivel === "mexicana" && m.categorias.includes(c.id)).length])
) as Record<IdCategoria, number>

const categoriaDe = (id: IdCategoria) => CATEGORIAS.find((c) => c.id === id)!

function Pastilla({ nivel }: { nivel: Nivel }) {
    const n = NIVELES[nivel]
    return (
        <span
            className={clsx(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                n.pastilla
            )}
        >
            <span className={clsx("size-2 rounded-full", n.punto)} aria-hidden />
            {n.etiqueta}
        </span>
    )
}

function TarjetaMarca({
    marca,
    conAlternativas = false,
    alBuscar,
}: {
    marca: Marca
    conAlternativas?: boolean
    alBuscar: (texto: string) => void
}) {
    const alternativas = conAlternativas ? alternativasMexicanas(marca, MARCAS) : []
    // Si no hay alternativa mexicana, la nota de la categoría explica por qué
    const notaCategoria =
        conAlternativas && marca.nivel !== "mexicana" && alternativas.length === 0
            ? marca.categorias.map((id) => categoriaDe(id).nota).find(Boolean)
            : undefined

    return (
        <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-lg font-semibold leading-tight text-white">{marca.nombre}</p>
                    <p className="mt-1 text-sm text-white/55">
                        {marca.dueno} · {marca.pais}
                    </p>
                </div>
                <Pastilla nivel={marca.nivel} />
            </div>
            {marca.nota && <p className="mt-3 text-sm leading-relaxed text-white/70">{marca.nota}</p>}

            {alternativas.length > 0 && (
                <div className="mt-4 border-t border-white/10 pt-3">
                    <p className="text-sm text-white/55">Alternativas mexicanas:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {alternativas.map((alt) => (
                            <button
                                key={alt.nombre}
                                type="button"
                                onClick={() => alBuscar(alt.nombre)}
                                className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-sm font-medium text-emerald-200 transition-colors hover:bg-emerald-400/20"
                            >
                                {alt.nombre}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {notaCategoria && (
                <p className="mt-4 border-t border-white/10 pt-3 text-sm leading-relaxed text-white/55">{notaCategoria}</p>
            )}
        </li>
    )
}

function SeccionCategoria({ categoria, alBuscar }: { categoria: Categoria; alBuscar: (texto: string) => void }) {
    const [verOtras, setVerOtras] = useState(false)
    const idLista = useId()
    const Icono = ICONOS[categoria.id]
    const marcas = marcasDeCategoria(categoria.id, MARCAS)
    const mexicanas = marcas.filter((m) => m.nivel === "mexicana")
    const otras = marcas.filter((m) => m.nivel !== "mexicana")
    // Sin marcas mexicanas, las demás se muestran de una vez
    const otrasVisibles = mexicanas.length === 0 || verOtras

    return (
        <section aria-labelledby={`${idLista}-titulo`}>
            <h2 id={`${idLista}-titulo`} className="flex items-center gap-2.5 text-xl font-semibold text-white">
                <Icono className="size-5 text-red-400" aria-hidden />
                {categoria.nombre}
            </h2>

            {mexicanas.length > 0 ? (
                <ul className="mt-4 grid gap-3">
                    {mexicanas.map((m) => (
                        <TarjetaMarca key={m.nombre} marca={m} alBuscar={alBuscar} />
                    ))}
                </ul>
            ) : (
                categoria.nota && (
                    <p className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-[15px] leading-relaxed text-amber-100/90">
                        {categoria.nota}
                    </p>
                )
            )}
            {mexicanas.length > 0 && categoria.nota && (
                <p className="mt-3 text-sm leading-relaxed text-white/55">{categoria.nota}</p>
            )}

            {otras.length > 0 && (
                <>
                    {mexicanas.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setVerOtras((v) => !v)}
                            aria-expanded={verOtras}
                            aria-controls={idLista}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-1 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
                        >
                            <ChevronDown className={clsx("size-4 transition-transform", verOtras && "rotate-180")} aria-hidden />
                            {verOtras ? "Ocultar" : "Ver"} las que no son mexicanas ({otras.length})
                        </button>
                    )}
                    {otrasVisibles && (
                        <ul id={idLista} className="mt-3 grid gap-3">
                            {otras.map((m) => (
                                <TarjetaMarca key={m.nombre} marca={m} alBuscar={alBuscar} />
                            ))}
                        </ul>
                    )}
                </>
            )}
        </section>
    )
}

function Categorias({ alElegir }: { alElegir: (categoria: Categoria) => void }) {
    return (
        <section aria-labelledby="titulo-categorias">
            <h2 id="titulo-categorias" className="text-sm font-medium uppercase tracking-[0.18em] text-white/45">
                O elige una categoría
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {CATEGORIAS.map((c) => {
                    const Icono = ICONOS[c.id]
                    const cuantas = MEXICANAS_POR_CATEGORIA[c.id]
                    return (
                        <li key={c.id}>
                            <button
                                type="button"
                                onClick={() => alElegir(c)}
                                className="flex h-full w-full flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-white/25 hover:bg-white/[0.06]"
                            >
                                <Icono className="size-5 text-red-400" aria-hidden />
                                <span className="text-[15px] font-medium leading-snug text-white">{c.nombre}</span>
                                <span className={clsx("mt-auto text-xs", cuantas > 0 ? "text-emerald-300/80" : "text-white/40")}>
                                    {cuantas > 0 ? `${cuantas} ${cuantas === 1 ? "mexicana" : "mexicanas"}` : "Sin mexicanas aún"}
                                </span>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}

export function Buscador() {
    const [texto, setTexto] = useState("")
    const campo = useRef<HTMLInputElement>(null)
    const arriba = useRef<HTMLDivElement>(null)
    const resultado = useMemo(() => buscar(texto, CATEGORIAS, MARCAS), [texto])
    const hayTexto = texto.trim().length > 0
    const sinResultados =
        hayTexto && !resultado.marcas.length && !resultado.duenos.length && !resultado.categorias.length

    // Funciona sin internet después de la primera visita (útil dentro del súper)
    useEffect(() => {
        if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return
        navigator.serviceWorker.register("/hecho-en-mexico-sw.js", { scope: "/hecho-en-mexico" }).catch(() => { })
    }, [])

    const buscarTexto = (nuevo: string) => {
        setTexto(nuevo)
        // Que el resultado quede a la vista, justo debajo del buscador
        arriba.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    return (
        <div ref={arriba} className="scroll-mt-0">
            <div className="sticky top-0 z-10 -mx-4 bg-background/90 px-4 py-3 backdrop-blur-md">
                <form role="search" onSubmit={(e) => {
                    e.preventDefault()
                    campo.current?.blur() // cierra el teclado en el cel
                }}>
                    <label htmlFor="buscar-producto" className="sr-only">
                        Busca un producto o una marca
                    </label>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/40" aria-hidden />
                        <input
                            ref={campo}
                            id="buscar-producto"
                            type="search"
                            enterKeyHint="search"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            value={texto}
                            onChange={(e) => setTexto(e.target.value)}
                            placeholder="Refresco, jabón, Bimbo…"
                            className="h-14 w-full rounded-2xl border border-white/15 bg-white/[0.06] pl-12 pr-12 text-[17px] text-white placeholder:text-white/35 focus:border-white/35 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                        />
                        {hayTexto && (
                            <button
                                type="button"
                                onClick={() => {
                                    setTexto("")
                                    campo.current?.focus()
                                }}
                                aria-label="Borrar búsqueda"
                                className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-xl text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <X className="size-5" aria-hidden />
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {!hayTexto && (
                <div className="mt-2 space-y-10">
                    <div className="flex flex-wrap gap-2" aria-label="Búsquedas de ejemplo">
                        {SUGERENCIAS.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setTexto(s)}
                                className="rounded-full border border-white/15 px-3.5 py-2 text-sm text-white/75 transition-colors hover:border-white/30 hover:text-white"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <Categorias alElegir={(c) => buscarTexto(c.nombre)} />
                </div>
            )}

            {hayTexto && (
                <div className="mt-4 space-y-12" aria-live="polite">
                    {resultado.marcas.length > 0 && (
                        <section aria-label="Marcas">
                            <ul className="grid gap-3">
                                {resultado.marcas.map((m) => (
                                    <TarjetaMarca key={m.nombre} marca={m} conAlternativas alBuscar={buscarTexto} />
                                ))}
                            </ul>
                        </section>
                    )}

                    {resultado.duenos.map((d) => (
                        <section key={d.dueno} aria-label={`Marcas de ${d.dueno}`}>
                            <h2 className="text-xl font-semibold text-white">
                                {resultado.marcas.some((m) => m.dueno.startsWith(d.dueno)) ? "Otras marcas" : "Marcas"} de{" "}
                                {d.dueno}
                            </h2>
                            <ul className="mt-4 grid gap-3">
                                {d.marcas.map((m) => (
                                    <TarjetaMarca key={m.nombre} marca={m} alBuscar={buscarTexto} />
                                ))}
                            </ul>
                        </section>
                    ))}

                    {resultado.categorias.map((c) => (
                        <SeccionCategoria key={c.id} categoria={c} alBuscar={buscarTexto} />
                    ))}

                    {sinResultados && (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                            <p className="text-lg font-semibold text-white">Todavía no tenemos «{texto.trim()}»</p>
                            <p className="mt-2 leading-relaxed text-white/65">
                                Prueba con el tipo de producto (por ejemplo «galletas») o revisa la etiqueta: dice quién lo
                                fabrica o quién lo importa.
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => buscarTexto("")}
                        className="text-sm font-medium text-white/55 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
                    >
                        Ver todas las categorías
                    </button>
                </div>
            )}
        </div>
    )
}
