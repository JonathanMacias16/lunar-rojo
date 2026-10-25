"use client"

import { useEffect, type ReactNode, type SyntheticEvent } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { X } from "lucide-react"
import clsx from "clsx"
import { preguntas, type Personaje } from "./personajes"

export const fuenteTerror = { fontFamily: "var(--font-terror), var(--font-geist-sans), serif" }

const caraOculta = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" } as const

// Si la foto no carga, queda el emoji que está detrás
const esconderSiFalla = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = "none"
}

// La foto del personaje encima de su emoji, llenando su caja
function Foto({ p, tamanos }: { p: Personaje; tamanos: string }) {
    return (
        <Image
            src={p.foto}
            alt=""
            fill
            unoptimized
            sizes={tamanos}
            draggable={false}
            referrerPolicy="no-referrer"
            onError={esconderSiFalla}
            className="object-cover object-[50%_22%]"
        />
    )
}

// Cuadrito con la foto (o el emoji) para listas y la barra de abajo
export function Retrato({ p, className }: { p: Personaje; className?: string }) {
    return (
        <span
            className={clsx("relative grid shrink-0 place-items-center overflow-hidden leading-none", className)}
            style={{ background: p.color }}
        >
            <span aria-hidden>{p.emoji}</span>
            <Foto p={p} tamanos="64px" />
        </span>
    )
}

// Una tarjeta del tablero. Al bajarla se voltea como en el juego de mesa.
export function Tarjeta({
    p,
    bajada = false,
    retraso = 0,
    marcada = false,
    alTocar,
    etiqueta,
}: {
    p: Personaje
    bajada?: boolean
    retraso?: number
    marcada?: boolean
    alTocar?: () => void
    etiqueta?: string
}) {
    return (
        <button
            type="button"
            onClick={alTocar}
            aria-pressed={bajada}
            aria-label={etiqueta ?? `${p.nombre}${bajada ? ", bajado" : ""}`}
            className={clsx(
                "relative aspect-[3/4] w-full rounded-xl outline-none cursor-pointer select-none [-webkit-tap-highlight-color:transparent]",
                "focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0714]",
                marcada && "ring-2 ring-orange-400 ring-offset-2 ring-offset-[#0d0714]"
            )}
            style={{ perspective: 700 }}
        >
            <span
                className="absolute inset-0 block transition-transform duration-500 ease-[cubic-bezier(0.3,1.3,0.5,1)] motion-reduce:duration-150"
                style={{
                    transformStyle: "preserve-3d",
                    transform: bajada ? "rotateX(180deg)" : "rotateX(0deg)",
                    transitionDelay: `${retraso}ms`,
                }}
            >
                {/* Frente */}
                <span
                    className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-white/15 shadow-[0_6px_14px_-6px_rgba(0,0,0,0.8)]"
                    style={{ ...caraOculta, background: p.color }}
                >
                    <span className="absolute inset-0 grid place-items-center pb-6 text-[clamp(1.7rem,8.5vw,2.6rem)] leading-none drop-shadow-[0_3px_4px_rgba(0,0,0,0.5)]">
                        {p.emoji}
                    </span>
                    <Foto p={p} tamanos="(min-width: 640px) 120px, 25vw" />
                    <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-55% to-black/90" />
                    <span className="flex-1" />
                    <span className="relative mx-1 mb-1.5 line-clamp-2 text-center text-[11px] font-semibold leading-[1.15] text-white sm:text-xs">
                        {p.nombre}
                    </span>
                </span>

                {/* Reverso: queda el nombre muy tenue por si se bajó sin querer */}
                <span
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-orange-500/20 bg-[#1d0f12]"
                    style={{
                        ...caraOculta,
                        transform: "rotateX(180deg)",
                        backgroundImage:
                            "repeating-linear-gradient(45deg, rgba(249,115,22,0.07) 0 6px, transparent 6px 12px)",
                    }}
                >
                    <span className="text-xl opacity-40 grayscale-[30%]">🎃</span>
                    <span className="line-clamp-2 px-1 text-center text-[10px] leading-tight text-orange-200/35">
                        {p.nombre}
                    </span>
                </span>
            </span>
        </button>
    )
}

// Tarjeta grande con de dónde viene el personaje
export function TarjetaGrande({ p }: { p: Personaje }) {
    return (
        <div
            className="relative mx-auto flex aspect-[3/4] w-44 flex-col overflow-hidden rounded-2xl border border-white/20 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.9)]"
            style={{ background: p.color }}
        >
            <span className="absolute inset-0 grid place-items-center pb-12 text-7xl leading-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                {p.emoji}
            </span>
            <Foto p={p} tamanos="176px" />
            <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-50% to-black/90" />
            <span className="flex-1" />
            <span className="relative px-3 pb-3 text-center">
                <span className="block text-base font-bold leading-tight text-white">{p.nombre}</span>
                <span className="mt-1 block text-[11px] leading-tight text-white/70">{p.de}</span>
            </span>
        </div>
    )
}

// Lo que se contesta de un personaje
export function Ficha({ p }: { p: Personaje }) {
    return (
        <ul className="grid grid-cols-1 gap-1 text-sm">
            {preguntas.map((q) => {
                const si = p.rasgos.has(q.rasgo)
                return (
                    <li
                        key={q.rasgo}
                        className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-1.5"
                    >
                        <span className="text-neutral-300">{q.ficha}</span>
                        <span className={clsx("font-semibold", si ? "text-lime-400" : "text-rose-400")}>
                            {si ? "Sí" : "No"}
                        </span>
                    </li>
                )
            })}
        </ul>
    )
}

// Hoja que sube desde abajo (en pantallas grandes queda al centro)
export function Hoja({
    abierta,
    alCerrar,
    titulo,
    children,
    cerrable = true,
}: {
    abierta: boolean
    alCerrar?: () => void
    titulo: string
    children: ReactNode
    cerrable?: boolean
}) {
    useEffect(() => {
        if (!abierta || !cerrable || !alCerrar) return
        const alTeclear = (e: KeyboardEvent) => {
            if (e.key === "Escape") alCerrar()
        }
        window.addEventListener("keydown", alTeclear)
        return () => window.removeEventListener("keydown", alTeclear)
    }, [abierta, cerrable, alCerrar])

    return (
        <AnimatePresence>
            {abierta && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                    <div
                        aria-hidden
                        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
                        onClick={cerrable ? alCerrar : undefined}
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={titulo}
                        className="relative max-h-[88dvh] w-full max-w-md overflow-y-auto overscroll-contain rounded-t-3xl border border-white/10 bg-[#170d22] px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 32, stiffness: 320 }}
                    >
                        {cerrable && alCerrar && (
                            <button
                                type="button"
                                onClick={alCerrar}
                                aria-label="Cerrar"
                                className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                            >
                                <X className="size-5" />
                            </button>
                        )}
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export function Boton({
    children,
    variante = "principal",
    className,
    ...resto
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: "principal" | "secundario" | "fantasma" | "si" | "no" }) {
    return (
        <button
            type="button"
            {...resto}
            className={clsx(
                "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-base font-semibold transition-[background-color,transform,opacity] active:scale-[0.97] cursor-pointer disabled:cursor-default disabled:opacity-40 disabled:active:scale-100 [-webkit-tap-highlight-color:transparent]",
                "outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0714]",
                variante === "principal" &&
                "bg-orange-500 text-[#1a0b02] shadow-[0_8px_24px_-10px_rgba(249,115,22,0.9)] hover:bg-orange-400",
                variante === "secundario" && "border border-white/15 bg-white/[0.06] text-neutral-100 hover:bg-white/[0.12]",
                variante === "fantasma" && "text-neutral-300 hover:bg-white/[0.06]",
                variante === "si" && "bg-lime-500 text-[#0f1a02] hover:bg-lime-400",
                variante === "no" && "bg-rose-500 text-[#1f0508] hover:bg-rose-400",
                className
            )}
        >
            {children}
        </button>
    )
}

// Luna, niebla y murciélagos detrás de todo
export function Fondo() {
    const reducir = useReducedMotion()
    const murcielagos = [
        { top: "9%", tam: 18, dur: 26, retraso: 0 },
        { top: "16%", tam: 13, dur: 34, retraso: 9 },
        { top: "5%", tam: 11, dur: 41, retraso: 18 },
    ]
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_-10%,rgba(249,115,22,0.22),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgba(126,34,206,0.25),transparent_55%)]" />
            <div className="absolute -right-10 -top-10 size-44 rounded-full bg-[radial-gradient(circle_at_40%_40%,#fff7ed,#fdba74_55%,#c2410c)] opacity-[0.18] blur-[1px]" />
            {!reducir &&
                murcielagos.map((m, i) => (
                    <motion.span
                        key={i}
                        className="absolute left-0 opacity-30"
                        style={{ top: m.top, fontSize: m.tam }}
                        initial={{ x: "-10vw" }}
                        animate={{ x: "110vw", y: [0, -14, 6, -10, 0] }}
                        transition={{
                            x: { duration: m.dur, repeat: Infinity, ease: "linear", delay: m.retraso },
                            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        }}
                    >
                        🦇
                    </motion.span>
                ))}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-purple-950/30 to-transparent" />
        </div>
    )
}

// Lluvia de dulces y calabazas cuando alguien gana
export function Festejo() {
    const reducir = useReducedMotion()
    if (reducir) return null
    const piezas = Array.from({ length: 22 }, (_, i) => ({
        emoji: ["🎃", "🍬", "👻", "🦇", "🍭", "⭐"][i % 6],
        x: (i * 37) % 100,
        dur: 2.6 + ((i * 7) % 10) / 6,
        retraso: ((i * 13) % 10) / 8,
        giro: ((i * 53) % 360) - 180,
    }))
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
            {piezas.map((p, i) => (
                <motion.span
                    key={i}
                    className="absolute top-0 text-2xl"
                    style={{ left: `${p.x}%` }}
                    initial={{ y: "-10vh", rotate: 0, opacity: 1 }}
                    animate={{ y: "110vh", rotate: p.giro, opacity: [1, 1, 0.8] }}
                    transition={{ duration: p.dur, delay: p.retraso, ease: "easeIn" }}
                >
                    {p.emoji}
                </motion.span>
            ))}
        </div>
    )
}
