"use client"

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react"
import { respuestas } from "./respuestas"
import { Triangulo } from "./triangulo"

type Estado = "inicio" | "agitando" | "respuesta"

type Respuesta = {
    id: number // cambia en cada pregunta para que el triángulo se vuelva a animar
    indice: number
    giro: number // inclinación con la que flota el triángulo
}

// Fuerza (m/s², con gravedad) a partir de la cual contamos que agitaron el celular
const FUERZA_AGITADO = 25

const elegirIndice = (anterior: number | null) => {
    let indice = Math.floor(Math.random() * respuestas.length)
    while (indice === anterior && respuestas.length > 1) {
        indice = Math.floor(Math.random() * respuestas.length)
    }
    return indice
}

type DeviceMotionConPermiso = typeof DeviceMotionEvent & {
    requestPermission?: () => Promise<"granted" | "denied">
}

// En iPhone hay que pedir permiso con un toque antes de leer el sensor de movimiento
const sinSuscripcion = () => () => { }
const sensorNecesitaPermiso = () =>
    typeof window.DeviceMotionEvent !== "undefined" &&
    typeof (DeviceMotionEvent as DeviceMotionConPermiso).requestPermission === "function" &&
    navigator.maxTouchPoints > 0

export default function BolaMagicaPage() {
    const [estado, setEstado] = useState<Estado>("inicio")
    const [volteada, setVolteada] = useState(false)
    const [respuesta, setRespuesta] = useState<Respuesta | null>(null)
    const [pregunta, setPregunta] = useState("")
    const [preguntaHecha, setPreguntaHecha] = useState("")
    const [puedeAgitar, setPuedeAgitar] = useState(false)
    const [permisoPedido, setPermisoPedido] = useState(false)
    const sensorConPermiso = useSyncExternalStore(sinSuscripcion, sensorNecesitaPermiso, () => false)
    const [bola, animarBola] = useAnimate<HTMLButtonElement>()
    const reducirMovimiento = useReducedMotion()
    const agitandoRef = useRef(false)
    const ultimoIndiceRef = useRef<number | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const preguntarRef = useRef<() => void>(() => { })

    const preguntar = async () => {
        if (agitandoRef.current) return
        agitandoRef.current = true

        setPreguntaHecha(pregunta.trim())
        setPregunta("")
        setRespuesta(null)
        setEstado("agitando")
        navigator.vibrate?.(300)

        if (reducirMovimiento) {
            await new Promise((resolver) => setTimeout(resolver, 400))
        } else {
            await animarBola(
                bola.current,
                {
                    x: [0, -18, 16, -14, 12, -8, 5, 0],
                    y: [0, 6, -5, 4, -3, 2, -1, 0],
                    rotate: [0, -8, 7, -6, 5, -3, 2, 0],
                },
                { duration: 0.9, ease: "easeInOut" }
            )
        }

        const indice = elegirIndice(ultimoIndiceRef.current)
        ultimoIndiceRef.current = indice
        setVolteada(true)
        setRespuesta({ id: Date.now(), indice, giro: Math.random() * 8 - 4 })
        setEstado("respuesta")
        agitandoRef.current = false
    }

    useEffect(() => {
        preguntarRef.current = preguntar
    })

    // Agitar el celular también hace la pregunta
    useEffect(() => {
        if (typeof window.DeviceMotionEvent === "undefined") return

        let detectado = false
        let ultimoAgitado = 0
        const alMoverse = (e: DeviceMotionEvent) => {
            const a = e.accelerationIncludingGravity
            if (a?.x == null || a.y == null || a.z == null) return
            if (!detectado) {
                detectado = true
                setPuedeAgitar(true)
            }
            const ahora = Date.now()
            if (Math.hypot(a.x, a.y, a.z) > FUERZA_AGITADO && ahora - ultimoAgitado > 1500) {
                ultimoAgitado = ahora
                preguntarRef.current()
            }
        }

        window.addEventListener("devicemotion", alMoverse)
        return () => window.removeEventListener("devicemotion", alMoverse)
    }, [])

    const activarSensor = async () => {
        try {
            await (DeviceMotionEvent as DeviceMotionConPermiso).requestPermission?.()
        } catch {
            // Si lo rechazan, la bola se sigue usando con toques
        }
        setPermisoPedido(true)
    }

    const enviar = (e: FormEvent) => {
        e.preventDefault()
        inputRef.current?.blur() // cierra el teclado para que se vea la bola
        preguntar()
    }

    const lineas = respuesta ? respuestas[respuesta.indice] : null

    return (
        <main
            className="relative min-h-dvh overflow-hidden bg-neutral-950 flex flex-col items-center justify-center gap-5 px-4 py-16"
            style={{ "--bola": "min(76vw, 340px, 46dvh)" } as CSSProperties}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(127,29,29,0.16),transparent_55%)]"
            />

            <h1 className="relative font-mono text-sm font-bold tracking-[0.3em] text-neutral-400 select-none">
                BOLA MÁGICA
            </h1>

            <p className="relative min-h-6 max-w-sm text-center text-neutral-300 italic break-words line-clamp-3">
                {preguntaHecha && estado !== "inicio" ? `“${preguntaHecha}”` : ""}
            </p>

            <div className="relative flex flex-col items-center">
                <motion.button
                    ref={bola}
                    type="button"
                    onClick={preguntar}
                    aria-label="Agitar la bola mágica"
                    whileTap={{ scale: 0.97 }}
                    className="relative isolate overflow-hidden rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-950 [-webkit-tap-highlight-color:transparent]"
                    style={{
                        width: "var(--bola)",
                        height: "var(--bola)",
                        background:
                            "radial-gradient(circle at 34% 28%, #4b4b4b 0%, #1e1e1e 22%, #0a0a0a 50%, #000 75%)",
                        boxShadow: [
                            "inset calc(var(--bola) * -0.06) calc(var(--bola) * -0.08) calc(var(--bola) * 0.14) rgba(0,0,0,0.9)",
                            "inset calc(var(--bola) * -0.01) calc(var(--bola) * -0.02) calc(var(--bola) * 0.05) rgba(153,27,27,0.3)",
                        ].join(", "),
                    }}
                >
                    <AnimatePresence initial={false}>
                        {!volteada ? (
                            <motion.div
                                key="ocho"
                                className="absolute inset-0 m-auto w-[46%] h-[46%] rounded-full flex items-center justify-center"
                                style={{
                                    background:
                                        "radial-gradient(circle at 38% 32%, #ffffff 0%, #f1f1f1 45%, #cfcfcf 85%, #a8a8a8 100%)",
                                    boxShadow: "inset -4px -6px 12px rgba(0,0,0,0.25)",
                                }}
                                exit={{ y: "-110%", scaleY: 0.3, opacity: 0 }}
                                transition={{ duration: 0.45, ease: "easeIn" }}
                            >
                                <span
                                    className="font-black leading-none text-black select-none"
                                    style={{ fontSize: "calc(var(--bola) * 0.3)" }}
                                >
                                    8
                                </span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="ventana"
                                className="absolute inset-0 m-auto w-[56%] h-[56%] rounded-full overflow-hidden"
                                style={{
                                    background:
                                        "radial-gradient(circle at 50% 50%, #0d1b56 0%, #08113a 45%, #030716 80%, #01020a 100%)",
                                    boxShadow: [
                                        "0 0 0 calc(var(--bola) * 0.012) #2a2a2a",
                                        "0 0 0 calc(var(--bola) * 0.024) #0d0d0d",
                                        "inset 0 calc(var(--bola) * 0.03) calc(var(--bola) * 0.06) rgba(0,0,0,0.85)",
                                    ].join(", "),
                                }}
                                initial={{ y: "110%", scaleY: 0.3, opacity: 0 }}
                                animate={{ y: 0, scaleY: 1, opacity: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                            >
                                <AnimatePresence>
                                    {respuesta && lineas && (
                                        <motion.div
                                            key={respuesta.id}
                                            className="absolute inset-0 m-auto w-[90%] h-[90%]"
                                            initial={{ opacity: 0, scale: 0.5, rotate: respuesta.giro * 8, filter: "blur(12px)" }}
                                            animate={{ opacity: 1, scale: 1, rotate: respuesta.giro, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, scale: 0.6, filter: "blur(10px)", transition: { duration: 0.35 } }}
                                            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                                        >
                                            <motion.div
                                                className="w-full h-full"
                                                animate={{ y: [0, -3, 0, 2, 0] }}
                                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <Triangulo lineas={lineas} />
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Reflejo del vidrio */}
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.14),transparent_45%)]"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Brillo de la bola */}
                    <span
                        aria-hidden
                        className="pointer-events-none absolute rounded-full"
                        style={{
                            left: "12%",
                            top: "7%",
                            width: "44%",
                            height: "26%",
                            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.2), transparent 70%)",
                            transform: "rotate(-32deg)",
                        }}
                    />
                    <span
                        aria-hidden
                        className="pointer-events-none absolute rounded-full"
                        style={{
                            left: "23%",
                            top: "13%",
                            width: "13%",
                            height: "5.5%",
                            background: "rgba(255,255,255,0.35)",
                            filter: "blur(3px)",
                            transform: "rotate(-34deg)",
                        }}
                    />
                </motion.button>

                {/* Sombra en el piso */}
                <div
                    aria-hidden
                    className="rounded-[50%] bg-black/80 blur-xl"
                    style={{
                        width: "calc(var(--bola) * 0.7)",
                        height: "calc(var(--bola) * 0.09)",
                        marginTop: "calc(var(--bola) * -0.02)",
                    }}
                />
            </div>

            <p aria-live="polite" className="sr-only">
                {lineas ? lineas.join(" ") : ""}
            </p>

            <form onSubmit={enviar} className="relative mt-2 w-full max-w-sm flex gap-2">
                <label htmlFor="pregunta" className="sr-only">
                    Tu pregunta
                </label>
                <input
                    id="pregunta"
                    ref={inputRef}
                    value={pregunta}
                    onChange={(e) => setPregunta(e.target.value)}
                    maxLength={140}
                    placeholder="Escribe tu pregunta…"
                    enterKeyHint="send"
                    autoComplete="off"
                    className="min-w-0 flex-1 rounded-full bg-white/5 border border-white/10 px-5 py-3 text-base text-neutral-100 placeholder:text-neutral-500 outline-none transition-colors focus:border-red-900/80 focus:bg-white/[0.07]"
                />
                <button
                    type="submit"
                    disabled={estado === "agitando"}
                    className="rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/20 disabled:opacity-40 cursor-pointer disabled:cursor-default"
                >
                    Preguntar
                </button>
            </form>

            <p className="relative min-h-5 text-center font-mono text-sm text-neutral-500 select-none">
                {estado === "agitando"
                    ? "Agitando…"
                    : estado === "respuesta"
                        ? "Toca la bola para preguntar otra vez"
                        : puedeAgitar
                            ? "Haz tu pregunta y agita el cel"
                            : "Haz tu pregunta y toca la bola"}
            </p>

            {sensorConPermiso && !permisoPedido && !puedeAgitar && (
                <button
                    type="button"
                    onClick={activarSensor}
                    className="relative rounded-full border border-white/10 px-4 py-2 text-xs text-neutral-400 transition-colors hover:bg-white/5 cursor-pointer"
                >
                    📳 Activar agitar el cel
                </button>
            )}

            <Image
                src="/logo_simple.png"
                alt="Lunar Rojo"
                width={40}
                height={40}
                className="size-10 bottom-4 left-4 absolute rounded-full opacity-50 contrast-125"
            />
        </main>
    )
}
