"use client"

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { Check, Copy, EllipsisVertical, Share, SquarePlus, X } from "lucide-react"

// Evento de Chrome/Edge/Samsung para mostrar su ventana de "Instalar app"
type EventoInstalar = Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

type Plataforma = "ios" | "android" | "app-interna" | "otra"

export const ENLACE_INSTALAR = "/bola-magica/instalar"

const sinSuscripcion = () => () => { }

const detectarPlataforma = (): Plataforma => {
    const ua = navigator.userAgent
    // Navegadores dentro de apps (Instagram, Facebook, TikTok…) no dejan agregar a inicio
    if (/Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|BytedanceWebview|Snapchat|Line\//i.test(ua)) return "app-interna"
    if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios"
    if (/Android/.test(ua)) return "android"
    return "otra"
}

const MODO_APP = "(display-mode: standalone)"
const suscribirModoApp = (avisar: () => void) => {
    const consulta = window.matchMedia(MODO_APP)
    consulta.addEventListener("change", avisar)
    return () => consulta.removeEventListener("change", avisar)
}
const abiertaComoApp = () =>
    window.matchMedia(MODO_APP).matches || (navigator as Navigator & { standalone?: boolean }).standalone === true

// Si entraron con el enlace de instalar, las instrucciones se abren solas
const llegoPorEnlace =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("instalar")

export function useInstalacion() {
    const plataforma = useSyncExternalStore<Plataforma>(sinSuscripcion, detectarPlataforma, () => "otra")
    const yaEsApp = useSyncExternalStore(suscribirModoApp, abiertaComoApp, () => false)
    const [evento, setEvento] = useState<EventoInstalar | null>(null)
    const [instalada, setInstalada] = useState(false)
    const [hoja, setHoja] = useState<"auto" | "abierta" | "cerrada">("auto")

    useEffect(() => {
        const alPoderInstalar = (e: Event) => {
            e.preventDefault() // la mostramos nosotros con nuestro botón
            setEvento(e as EventoInstalar)
        }
        const alInstalar = () => {
            setInstalada(true)
            setEvento(null)
        }
        window.addEventListener("beforeinstallprompt", alPoderInstalar)
        window.addEventListener("appinstalled", alInstalar)

        // Quita el "?instalar" para que el acceso directo abra la bola limpia
        if (llegoPorEnlace) window.history.replaceState(window.history.state, "", window.location.pathname)

        return () => {
            window.removeEventListener("beforeinstallprompt", alPoderInstalar)
            window.removeEventListener("appinstalled", alInstalar)
        }
    }, [])

    useEffect(() => {
        if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return
        navigator.serviceWorker.register("/bola-magica-sw.js", { scope: "/bola-magica" }).catch(() => { })
    }, [])

    const disponible = !yaEsApp && !instalada && (evento !== null || plataforma !== "otra")

    const instalar = async () => {
        if (!evento) return
        await evento.prompt()
        const { outcome } = await evento.userChoice
        setEvento(null) // Chrome solo deja usar el evento una vez
        if (outcome === "accepted") setHoja("cerrada")
    }

    return {
        disponible,
        abierta: disponible && (hoja === "abierta" || (hoja === "auto" && llegoPorEnlace)),
        plataforma,
        yaEsApp,
        puedeInstalarDirecto: evento !== null,
        instalar,
        // Con Chrome basta un toque; en los demás mostramos cómo hacerlo
        abrir: () => (evento ? instalar() : setHoja("abierta")),
        cerrar: () => setHoja("cerrada"),
    }
}

function Paso({ numero, icono, children }: { numero: number; icono: ReactNode; children: ReactNode }) {
    return (
        <li className="flex items-center gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-neutral-200">
                {icono}
            </span>
            <span className="text-[15px] leading-snug text-neutral-300">
                <span className="mr-1.5 font-mono text-xs text-neutral-500">{numero}.</span>
                {children}
            </span>
        </li>
    )
}

export function HojaInstalar({
    abierta,
    cerrar,
    plataforma,
    puedeInstalarDirecto,
    instalar,
}: ReturnType<typeof useInstalacion>) {
    const [copiado, setCopiado] = useState(false)

    useEffect(() => {
        if (!abierta) return
        const alTeclear = (e: KeyboardEvent) => {
            if (e.key === "Escape") cerrar()
        }
        window.addEventListener("keydown", alTeclear)
        return () => window.removeEventListener("keydown", alTeclear)
    }, [abierta, cerrar])

    const copiarEnlace = async () => {
        try {
            await navigator.clipboard.writeText(window.location.origin + ENLACE_INSTALAR)
            setCopiado(true)
            setTimeout(() => setCopiado(false), 2000)
        } catch {
            // Si no deja copiar, al menos queda el texto de las instrucciones
        }
    }

    const fuerte = (texto: string) => <strong className="font-semibold text-white">{texto}</strong>

    let contenido: ReactNode
    if (puedeInstalarDirecto) {
        contenido = (
            <button
                type="button"
                onClick={instalar}
                autoFocus
                className="w-full rounded-full bg-red-800 py-3.5 font-medium text-white transition-colors hover:bg-red-700 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
                Agregar a inicio
            </button>
        )
    } else if (plataforma === "app-interna") {
        contenido = (
            <div className="flex flex-col gap-4">
                <p className="text-[15px] leading-snug text-neutral-300">
                    Desde esta app no se puede. Toca el menú {fuerte("•••")} y elige {fuerte("Abrir en el navegador")}
                    , o copia el enlace y pégalo en Safari o Chrome.
                </p>
                <button
                    type="button"
                    onClick={copiarEnlace}
                    autoFocus
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-white/10 py-3.5 font-medium text-white transition-colors hover:bg-white/15 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                >
                    {copiado ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copiado ? "¡Copiado!" : "Copiar enlace"}
                </button>
            </div>
        )
    } else if (plataforma === "ios") {
        contenido = (
            <ol className="flex flex-col gap-4">
                <Paso numero={1} icono={<Share className="size-5" />}>
                    Toca {fuerte("Compartir")}. Si no lo ves, está en el menú {fuerte("•••")}
                </Paso>
                <Paso numero={2} icono={<SquarePlus className="size-5" />}>
                    Elige {fuerte("Agregar a inicio")} (a veces hay que bajar en la lista)
                </Paso>
                <Paso numero={3} icono={<Check className="size-5" />}>
                    Toca {fuerte("Agregar")}
                </Paso>
            </ol>
        )
    } else {
        contenido = (
            <ol className="flex flex-col gap-4">
                <Paso numero={1} icono={<EllipsisVertical className="size-5" />}>
                    Abre el menú {fuerte("⋮")} del navegador
                </Paso>
                <Paso numero={2} icono={<SquarePlus className="size-5" />}>
                    Elige {fuerte("Agregar a la pantalla principal")} o {fuerte("Instalar app")}
                </Paso>
                <Paso numero={3} icono={<Check className="size-5" />}>
                    Confirma con {fuerte("Agregar")} o {fuerte("Instalar")}
                </Paso>
            </ol>
        )
    }

    return (
        <AnimatePresence>
            {abierta && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div aria-hidden className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={cerrar} />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-instalar"
                        className="relative w-full max-w-md rounded-t-3xl border border-white/10 bg-neutral-900 px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl"
                        initial={{ y: 60 }}
                        animate={{ y: 0 }}
                        exit={{ y: 60 }}
                        transition={{ type: "spring", damping: 28, stiffness: 320 }}
                    >
                        <button
                            type="button"
                            onClick={cerrar}
                            aria-label="Cerrar"
                            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-white/5 hover:text-neutral-300 cursor-pointer"
                        >
                            <X className="size-5" />
                        </button>

                        <div className="flex items-center gap-4 pr-8">
                            <Image
                                src="/bola-magica-icono-192.png"
                                alt=""
                                width={56}
                                height={56}
                                className="size-14 shrink-0 rounded-2xl"
                            />
                            <div>
                                <h2 id="titulo-instalar" className="text-lg font-semibold text-white">
                                    Lleva la bola en tu cel
                                </h2>
                                <p className="text-sm text-neutral-400">
                                    Ábrela desde tu pantalla de inicio, como una app.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">{contenido}</div>

                        <button
                            type="button"
                            onClick={cerrar}
                            className="mt-4 w-full py-2 text-sm text-neutral-500 transition-colors hover:text-neutral-300 cursor-pointer"
                        >
                            Ahora no
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
