"use client"

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react"
import { Eye, EyeOff, Mic, Volume2, VolumeX } from "lucide-react"
import clsx from "clsx"
import { respuestas } from "./respuestas"
import { sonidos } from "./sonidos"
import { Triangulo } from "./triangulo"
import { HojaInstalar, useInstalacion } from "./instalacion"

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

// "Solo la bola": esconde todo lo demás. Se recuerda en este cel.
const CLAVE_SOLO_BOLA = "bola-magica:solo-bola"
let soloBolaElegido: boolean | null = null
const avisosSoloBola = new Set<() => void>()
const suscribirSoloBola = (avisar: () => void) => {
    avisosSoloBola.add(avisar)
    return () => {
        avisosSoloBola.delete(avisar)
    }
}
const leerSoloBola = () => {
    if (soloBolaElegido === null) {
        try {
            soloBolaElegido = localStorage.getItem(CLAVE_SOLO_BOLA) === "1"
        } catch {
            soloBolaElegido = false
        }
    }
    return soloBolaElegido
}
const guardarSoloBola = (valor: boolean) => {
    soloBolaElegido = valor
    try {
        localStorage.setItem(CLAVE_SOLO_BOLA, valor ? "1" : "0")
    } catch {
        // Sin almacenamiento (modo privado): solo dura esta visita
    }
    avisosSoloBola.forEach((avisar) => avisar())
}

// En iPhone hay que pedir permiso con un toque antes de leer el sensor de movimiento
const sinSuscripcion = () => () => { }
const sensorNecesitaPermiso = () =>
    typeof window.DeviceMotionEvent !== "undefined" &&
    typeof (DeviceMotionEvent as DeviceMotionConPermiso).requestPermission === "function" &&
    navigator.maxTouchPoints > 0

// Dictado por voz (Chrome, Edge y Safari lo tienen; Firefox no)
type Reconocedor = {
    lang: string
    interimResults: boolean
    continuous: boolean
    onstart: (() => void) | null
    onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
    onerror: ((e: { error: string }) => void) | null
    onend: (() => void) | null
    start: () => void
    stop: () => void
    abort: () => void
}
type ConstructorReconocedor = new () => Reconocedor

const obtenerReconocedor = () => {
    const w = window as unknown as {
        SpeechRecognition?: ConstructorReconocedor
        webkitSpeechRecognition?: ConstructorReconocedor
    }
    return w.SpeechRecognition ?? w.webkitSpeechRecognition
}
const hayDictado = () => obtenerReconocedor() !== undefined

const MENSAJES_DICTADO: Record<string, string> = {
    "not-allowed": "Dale permiso al micrófono para dictar",
    // En iPhone sale cuando Dictado está apagado en Ajustes
    "service-not-allowed": "No puedo dictar, usa el 🎤 del teclado",
    "no-speech": "No te escuché, intenta otra vez",
    "audio-capture": "No encontré el micrófono",
    network: "El dictado necesita internet",
}

// Tiempos del dictado (ms). Safari en iPhone a veces no avisa que terminaste
// de hablar, así que nosotros decidimos cuándo parar.
const SILENCIO_PARA_CONTESTAR = 1500
const ESPERA_SIN_VOZ = 7000
const LIMITE_DICTADO = 15000

// El texto puede llegar en pedazos ("me va", " a ir bien") o repetido y más
// largo cada vez ("me va", "me va a ir bien"); esto arma la frase en ambos casos
const unirResultados = (resultados: ArrayLike<ArrayLike<{ transcript: string }>>) => {
    let texto = ""
    for (const resultado of Array.from(resultados)) {
        const parte = resultado[0]?.transcript ?? ""
        texto = texto && !parte.startsWith(texto.trim()) ? texto + parte : parte
    }
    return texto
}

// El dictado llega sin signos: "me va a ir bien" → "¿Me va a ir bien?"
const comoPregunta = (texto: string) => {
    const limpio = texto.trim().replace(/^¿/, "").replace(/\?$/, "")
    if (!limpio) return ""
    return `¿${limpio[0].toUpperCase()}${limpio.slice(1)}?`
}

export default function BolaMagicaPage() {
    const [estado, setEstado] = useState<Estado>("inicio")
    const [volteada, setVolteada] = useState(false)
    const [respuesta, setRespuesta] = useState<Respuesta | null>(null)
    const [pregunta, setPregunta] = useState("")
    const [preguntaHecha, setPreguntaHecha] = useState("")
    const [puedeAgitar, setPuedeAgitar] = useState(false)
    const [permisoPedido, setPermisoPedido] = useState(false)
    const sensorConPermiso = useSyncExternalStore(sinSuscripcion, sensorNecesitaPermiso, () => false)
    const hayDictadoEnNavegador = useSyncExternalStore(sinSuscripcion, hayDictado, () => false)
    const [escuchando, setEscuchando] = useState(false)
    const [avisoDictado, setAvisoDictado] = useState("")
    const [sonidoActivo, setSonidoActivo] = useState(true)
    const instalacion = useInstalacion()
    const soloBola = useSyncExternalStore(suscribirSoloBola, leerSoloBola, () => false)
    // Solo cuenta los cambios hechos con el botón, para no animar al cargar la página
    const [cambiosVista, setCambiosVista] = useState(0)
    const [bola, animarBola] = useAnimate<HTMLButtonElement>()
    const reducirMovimiento = useReducedMotion()
    const agitandoRef = useRef(false)
    const ultimoIndiceRef = useRef<number | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const preguntarRef = useRef<(texto?: string) => void>(() => { })
    const reconocedorRef = useRef<Reconocedor | null>(null) // se reusa para no pedir permiso cada vez
    const dictadoRef = useRef<{ terminar: () => void; cancelar: () => void } | null>(null)
    const fallasDictadoRef = useRef(0)
    const sonidoRef = useRef(true)

    // En iPhone, la bola agregada a inicio no puede usar el dictado del navegador
    const dictadoPorTeclado = instalacion.plataforma === "ios" && instalacion.yaEsApp

    const mostrarMicrofono = hayDictadoEnNavegador || dictadoPorTeclado

    const detenerDictado = () => dictadoRef.current?.cancelar()

    const preguntar = async (texto = pregunta) => {
        if (agitandoRef.current) return
        agitandoRef.current = true
        detenerDictado()

        setPreguntaHecha(texto.trim())
        setPregunta("")
        setAvisoDictado("")
        setRespuesta(null)
        setEstado("agitando")
        navigator.vibrate?.(300)

        const duracion = reducirMovimiento ? 0.4 : 0.9
        if (sonidoRef.current) sonidos.agitar(duracion)

        if (reducirMovimiento) {
            await new Promise((resolver) => setTimeout(resolver, duracion * 1000))
        } else {
            await animarBola(
                bola.current,
                {
                    x: [0, -18, 16, -14, 12, -8, 5, 0],
                    y: [0, 6, -5, 4, -3, 2, -1, 0],
                    rotate: [0, -8, 7, -6, 5, -3, 2, 0],
                },
                { duration: duracion, ease: "easeInOut" }
            )
        }

        const indice = elegirIndice(ultimoIndiceRef.current)
        ultimoIndiceRef.current = indice
        if (sonidoRef.current) {
            if (!volteada) sonidos.voltear()
            sonidos.revelar(respuestas[indice].tipo)
        }
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

    const dictar = (reintento = false) => {
        // Si ya está escuchando, el toque termina el dictado y pregunta con lo que oyó
        if (dictadoRef.current) {
            dictadoRef.current.terminar()
            return
        }
        if (dictadoPorTeclado) {
            inputRef.current?.focus()
            setAvisoDictado("Usa el 🎤 de tu teclado para dictar")
            return
        }
        const ConstructorReconocedor = obtenerReconocedor()
        if (!ConstructorReconocedor || agitandoRef.current) return

        // En iPhone el micrófono se puede trabar si el audio de la página está activo
        sonidos.pausar()

        const rec = reconocedorRef.current ?? new ConstructorReconocedor()
        reconocedorRef.current = rec
        rec.lang = "es-MX"
        rec.interimResults = true
        rec.continuous = false

        let texto = ""
        let huboError = false
        let terminado = false
        let sinVoz: ReturnType<typeof setTimeout> | undefined
        let silencio: ReturnType<typeof setTimeout> | undefined
        const limite = setTimeout(() => terminar(), LIMITE_DICTADO)

        const cancelar = () => {
            if (terminado) return
            terminado = true
            clearTimeout(limite)
            clearTimeout(sinVoz)
            clearTimeout(silencio)
            rec.onstart = null
            rec.onresult = null
            rec.onerror = null
            rec.onend = null
            try {
                rec.abort()
            } catch {
                // Ya estaba detenido
            }
            dictadoRef.current = null
            setEscuchando(false)
        }

        const terminar = () => {
            if (terminado) return
            cancelar()
            const preguntaDictada = comoPregunta(texto)
            if (preguntaDictada) {
                fallasDictadoRef.current = 0
                preguntarRef.current(preguntaDictada)
                return
            }
            // No oyó nada: la próxima vez empieza con un reconocedor nuevo por si este se trabó
            reconocedorRef.current = null
            fallasDictadoRef.current += 1
            if (!huboError) {
                setAvisoDictado(
                    fallasDictadoRef.current > 1
                        ? "Prueba el 🎤 de tu teclado"
                        : "No te escuché, intenta otra vez"
                )
            }
        }

        rec.onstart = () => {
            sinVoz = setTimeout(terminar, ESPERA_SIN_VOZ)
        }
        rec.onresult = (e) => {
            texto = unirResultados(e.results)
            setPregunta(texto)
            clearTimeout(sinVoz)
            clearTimeout(silencio)
            silencio = setTimeout(terminar, SILENCIO_PARA_CONTESTAR)
        }
        rec.onerror = (e) => {
            if (e.error === "aborted") return
            huboError = true
            setAvisoDictado(MENSAJES_DICTADO[e.error] ?? "No pude escucharte, intenta otra vez")
            terminar()
        }
        rec.onend = terminar

        dictadoRef.current = { terminar, cancelar }
        setAvisoDictado("")
        setPregunta("")
        setEscuchando(true)
        try {
            rec.start()
        } catch {
            // El reconocedor quedó en mal estado: uno nuevo, una sola vez
            cancelar()
            reconocedorRef.current = null
            if (!reintento) dictar(true)
        }
    }

    // Si se salen de la página a media frase, apaga el micrófono
    useEffect(() => () => dictadoRef.current?.cancelar(), [])

    const alternarSoloBola = () => {
        guardarSoloBola(!soloBola)
        setCambiosVista((n) => n + 1)
    }

    const alternarSonido = () => {
        sonidoRef.current = !sonidoRef.current
        setSonidoActivo(sonidoRef.current)
    }

    const enviar = (e: FormEvent) => {
        e.preventDefault()
        inputRef.current?.blur() // cierra el teclado para que se vea la bola
        preguntar()
    }

    const lineas = respuesta ? respuestas[respuesta.indice].lineas : null

    const pista = escuchando
        ? "Te escucho… habla ahora"
        : avisoDictado
            ? avisoDictado
            : estado === "agitando"
                ? "Agitando…"
                : estado === "respuesta"
                    ? "Toca la bola para preguntar otra vez"
                    : puedeAgitar
                        ? "Piensa tu pregunta y agita el cel"
                        : "Piensa tu pregunta y toca la bola"

    return (
        <main
            className="relative min-h-dvh overflow-hidden bg-neutral-950 flex flex-col items-center justify-center gap-5 px-4 py-16"
            style={{ "--bola": soloBola ? "min(88vw, 460px, 72dvh)" : "min(76vw, 340px, 46dvh)" } as CSSProperties}
            // El primer toque en cualquier parte deja sonar el audio (también al agitar el cel)
            onClick={() => {
                if (!dictadoRef.current) sonidos.desbloquear()
            }}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(127,29,29,0.16),transparent_55%)]"
            />

            <div className="absolute top-4 right-4 z-10 flex items-center gap-1">
                <AnimatePresence initial={false}>
                    {!soloBola && (
                        <motion.button
                            key="sonido"
                            type="button"
                            onClick={alternarSonido}
                            aria-label={sonidoActivo ? "Silenciar" : "Activar sonido"}
                            className="grid size-10 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-white/5 hover:text-neutral-300 cursor-pointer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {sonidoActivo ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
                        </motion.button>
                    )}
                </AnimatePresence>
                <button
                    type="button"
                    onClick={alternarSoloBola}
                    aria-label={soloBola ? "Mostrar todo" : "Dejar solo la bola"}
                    title={soloBola ? "Mostrar todo" : "Dejar solo la bola"}
                    className={clsx(
                        "grid size-10 place-items-center rounded-full transition-colors hover:bg-white/5 cursor-pointer",
                        soloBola ? "text-neutral-600 hover:text-neutral-300" : "text-neutral-500 hover:text-neutral-300"
                    )}
                >
                    {soloBola ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                </button>
            </div>

            <AnimatePresence mode="popLayout" initial={false}>
                {!soloBola && (
                    <motion.div
                        key="arriba"
                        className="relative flex w-full flex-col items-center gap-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.2 } }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    >
                        <h1 className="font-mono text-sm font-bold tracking-[0.3em] text-neutral-400 select-none">
                            BOLA MÁGICA
                        </h1>

                        <p className="min-h-6 max-w-sm text-center text-neutral-300 italic break-words line-clamp-3">
                            {preguntaHecha && estado !== "inicio" ? `“${preguntaHecha}”` : ""}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                layout
                layoutDependency={cambiosVista}
                transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
                className="relative flex flex-col items-center"
            >
                <motion.button
                    ref={bola}
                    type="button"
                    onClick={() => preguntar()}
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
            </motion.div>

            <p aria-live="polite" className="sr-only">
                {lineas ? lineas.join(" ") : ""}
            </p>

            <AnimatePresence mode="popLayout" initial={false}>
                {!soloBola && (
                    <motion.div
                        key="abajo"
                        className="relative flex w-full flex-col items-center gap-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.2 } }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    >
                        <form onSubmit={enviar} className="mt-2 w-full max-w-sm flex gap-2">
                            <label htmlFor="pregunta" className="sr-only">
                                Tu pregunta
                            </label>
                            <div className="relative min-w-0 flex-1">
                                <input
                                    id="pregunta"
                                    ref={inputRef}
                                    value={pregunta}
                                    onChange={(e) => setPregunta(e.target.value)}
                                    maxLength={140}
                                    placeholder={escuchando ? "Te escucho…" : "Escribe tu pregunta…"}
                                    enterKeyHint="send"
                                    autoComplete="off"
                                    className={clsx(
                                        "w-full rounded-full bg-white/5 border border-white/10 py-3 pl-5 text-base text-neutral-100 placeholder:text-neutral-500 outline-none transition-colors focus:border-red-900/80 focus:bg-white/[0.07]",
                                        mostrarMicrofono ? "pr-12" : "pr-5"
                                    )}
                                />
                                {mostrarMicrofono && (
                                    <button
                                        type="button"
                                        onClick={() => dictar()}
                                        aria-label={escuchando ? "Dejar de escuchar" : "Dictar tu pregunta"}
                                        className={clsx(
                                            "absolute right-1.5 top-1/2 -translate-y-1/2 grid size-9 place-items-center rounded-full transition-colors cursor-pointer",
                                            escuchando
                                                ? "bg-red-800 text-white animate-pulse"
                                                : "text-neutral-400 hover:bg-white/10 hover:text-neutral-200"
                                        )}
                                    >
                                        <Mic className="size-[18px]" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={estado === "agitando"}
                                className="rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/20 disabled:opacity-40 cursor-pointer disabled:cursor-default"
                            >
                                Preguntar
                            </button>
                        </form>

                        <p className="min-h-5 text-center font-mono text-sm text-neutral-500 select-none">
                            {pista}
                        </p>

                        <div className="flex flex-wrap justify-center gap-2">
                            {sensorConPermiso && !permisoPedido && !puedeAgitar && (
                                <button
                                    type="button"
                                    onClick={activarSensor}
                                    className="rounded-full border border-white/10 px-4 py-2 text-xs text-neutral-400 transition-colors hover:bg-white/5 cursor-pointer"
                                >
                                    📳 Activar agitar el cel
                                </button>
                            )}
                            {instalacion.disponible && (
                                <button
                                    type="button"
                                    onClick={instalacion.abrir}
                                    className="rounded-full border border-white/10 px-4 py-2 text-xs text-neutral-400 transition-colors hover:bg-white/5 cursor-pointer"
                                >
                                    📲 Agregar a inicio
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <HojaInstalar {...instalacion} />

            {!soloBola && (
                <Image
                    src="/logo_simple.png"
                    alt="Lunar Rojo"
                    width={40}
                    height={40}
                    className="size-10 bottom-4 left-4 absolute rounded-full opacity-50 contrast-125"
                />
            )}
        </main>
    )
}
