"use client"

import { useState, useSyncExternalStore, type FormEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ChevronDown, Users, Wifi } from "lucide-react"
import clsx from "clsx"
import { Boton, fuenteTerror } from "./componentes"
import { limpiarCodigo, nuevoCodigo, type Partida } from "./juego"
import { personajes } from "./personajes"

const CLAVE_NOMBRE = "adivina-quien:nombre"

const sinSuscripcion = () => () => { }
const leerNombre = () => {
    try {
        return localStorage.getItem(CLAVE_NOMBRE) ?? ""
    } catch {
        return ""
    }
}
const guardarNombre = (nombre: string) => {
    try {
        localStorage.setItem(CLAVE_NOMBRE, nombre)
    } catch {
        // Sin almacenamiento se pide otra vez la próxima
    }
}
// El código que viene en el link de invitación (?sala=ABCD)
const leerSalaDelLink = () => limpiarCodigo(new URLSearchParams(window.location.search).get("sala") ?? "")

type Panel = "unirse" | "local" | null

export function Inicio({
    guardada,
    alCrear,
    alUnirse,
    alJugarLocal,
    alContinuar,
    alOlvidar,
}: {
    guardada: Partida | null
    alCrear: (nombre: string) => void
    alUnirse: (codigo: string, nombre: string) => void
    alJugarLocal: (codigo: string, nombre: string) => void
    alContinuar: () => void
    alOlvidar: () => void
}) {
    const nombreGuardado = useSyncExternalStore(sinSuscripcion, leerNombre, () => "")
    const salaDelLink = useSyncExternalStore(sinSuscripcion, leerSalaDelLink, () => "")
    const [nombreEscrito, setNombreEscrito] = useState<string | null>(null)
    const [panelElegido, setPanel] = useState<Panel | undefined>(undefined)
    const [codigoEscrito, setCodigo] = useState<string | null>(null)
    const [verReglas, setVerReglas] = useState(false)

    const nombre = (nombreEscrito ?? nombreGuardado).slice(0, 20)
    const panel = panelElegido === undefined ? (salaDelLink ? "unirse" : null) : panelElegido
    const codigo = codigoEscrito ?? (panel === "unirse" ? salaDelLink : "")
    const codigoCompleto = codigo.length === 4

    const conNombre = (accion: (n: string) => void) => {
        const limpio = nombre.trim()
        guardarNombre(limpio)
        accion(limpio)
    }

    const enviarCodigo = (e: FormEvent) => {
        e.preventDefault()
        if (!codigoCompleto) return
        if (panel === "unirse") conNombre((n) => alUnirse(codigo, n))
        else conNombre((n) => alJugarLocal(codigo, n))
    }

    const abrir = (cual: Panel) => {
        setPanel(panel === cual ? null : cual)
        setCodigo(null)
    }

    const puedeContinuar = guardada && !guardada.final
    // Llegó con el link de invitación: lo principal es entrar, no crear otra
    const invitacion = Boolean(salaDelLink) && panelElegido === undefined

    const formulario = (
        <motion.form
            key={panel}
            onSubmit={enviarCodigo}
            className="overflow-hidden"
            initial={invitacion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
        >
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-neutral-300">
                    {panel === "unirse"
                        ? salaDelLink && codigoEscrito === null
                            ? "Te invitaron a esta partida:"
                            : "Escribe el código que le salió a tu rival:"
                        : "Uno toca «Inventar» y le dice el código al otro. Si los dos escriben el mismo código, les sale el mismo tablero."}
                </p>
                <div className="mt-3 flex gap-2">
                    <input
                        value={codigo}
                        onChange={(e) => setCodigo(limpiarCodigo(e.target.value))}
                        placeholder="ABCD"
                        aria-label="Código de la partida"
                        autoCapitalize="characters"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        enterKeyHint="go"
                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-center font-mono text-2xl font-bold uppercase tracking-[0.4em] text-orange-200 outline-none placeholder:text-neutral-700 focus:border-orange-500/60"
                    />
                    {panel === "local" && (
                        <Boton
                            variante="secundario"
                            className="px-3 text-sm"
                            onClick={() => setCodigo(nuevoCodigo())}
                        >
                            Inventar
                        </Boton>
                    )}
                </div>
                <Boton type="submit" className="mt-3 w-full" disabled={!codigoCompleto}>
                    {panel === "unirse" ? "Entrar" : "¡A jugar!"}
                </Boton>
            </div>
        </motion.form>
    )

    return (
        <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-[max(2.5rem,env(safe-area-inset-top))]">
            <header className="text-center">
                <motion.div
                    className="mb-2 text-5xl"
                    animate={{ rotate: [0, -6, 6, -3, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2 }}
                    aria-hidden
                >
                    🎃
                </motion.div>
                <h1
                    className="text-[3.25rem] leading-[0.95] text-orange-500 drop-shadow-[0_4px_18px_rgba(249,115,22,0.45)]"
                    style={fuenteTerror}
                >
                    Adivina Quién
                </h1>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.35em] text-purple-300/80">
                    Edición Halloween
                </p>
                <p className="mx-auto mt-4 max-w-xs text-sm text-neutral-400">
                    {personajes.length} personajes de películas, series, caricaturas y La casita del horror. Para dos
                    personas, cada quien en su cel.
                </p>
            </header>

            <div className="mt-8 flex flex-col gap-3">
                {puedeContinuar && (
                    <div className="rounded-2xl border border-orange-500/30 bg-orange-500/[0.08] p-4">
                        <p className="text-sm text-orange-100">
                            Tienes una partida a medias
                            {guardada.rivalNombre ? ` con ${guardada.rivalNombre}` : ""} · código{" "}
                            <span className="font-mono font-bold tracking-widest">{guardada.codigo}</span>
                        </p>
                        <div className="mt-3 flex gap-2">
                            <Boton className="flex-1" onClick={alContinuar}>
                                Continuar
                            </Boton>
                            <Boton variante="fantasma" onClick={alOlvidar}>
                                Descartar
                            </Boton>
                        </div>
                    </div>
                )}

                <label className="block">
                    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Tu nombre
                    </span>
                    <input
                        value={nombre}
                        onChange={(e) => setNombreEscrito(e.target.value)}
                        maxLength={20}
                        placeholder="Para que tu rival sepa quién eres"
                        autoComplete="nickname"
                        enterKeyHint="done"
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-base text-neutral-100 outline-none transition-colors placeholder:text-neutral-500 focus:border-orange-500/60 focus:bg-white/[0.08]"
                    />
                </label>

                {invitacion ? (
                    <>
                        {formulario}
                        <Boton variante="secundario" onClick={() => conNombre(alCrear)}>
                            Mejor crear otra partida
                        </Boton>
                    </>
                ) : (
                    <>
                        <Boton onClick={() => abrir("local")} aria-expanded={panel === "local"} className="mt-1">
                            <Users className="size-5" /> Jugar en persona
                        </Boton>
                        <p className="-mt-1 text-center text-xs text-neutral-500">
                            Cada quien en su cel, sin internet. Las preguntas se hacen en voz alta.
                        </p>
                        <AnimatePresence initial={false}>{panel === "local" && formulario}</AnimatePresence>

                        <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500">
                            <span className="h-px flex-1 bg-white/10" />
                            o conecten los dos cels
                            <span className="h-px flex-1 bg-white/10" />
                        </div>
                        <p className="-mt-1 text-center text-xs text-neutral-500">
                            Necesita internet, pero las preguntas de la lista se contestan solas y lleva los turnos.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <Boton variante="secundario" className="px-3" onClick={() => conNombre(alCrear)}>
                                <Wifi className="size-5" /> Crear
                            </Boton>
                            <Boton
                                variante="secundario"
                                className="px-3"
                                onClick={() => abrir("unirse")}
                                aria-expanded={panel === "unirse"}
                            >
                                Unirme
                            </Boton>
                        </div>
                        <AnimatePresence initial={false}>{panel === "unirse" && formulario}</AnimatePresence>
                    </>
                )}
            </div>

            <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03]">
                <button
                    type="button"
                    onClick={() => setVerReglas((v) => !v)}
                    aria-expanded={verReglas}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-neutral-200 cursor-pointer"
                >
                    ¿Cómo se juega?
                    <ChevronDown className={clsx("size-4 transition-transform", verReglas && "rotate-180")} />
                </button>
                <AnimatePresence initial={false}>
                    {verReglas && (
                        <motion.ol
                            className="list-decimal space-y-2 overflow-hidden pl-9 pr-4 text-sm text-neutral-400"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1, paddingBottom: 16 }}
                            exit={{ height: 0, opacity: 0, paddingBottom: 0 }}
                        >
                            <li>
                                Los dos escriben el mismo código (en persona) o uno crea la partida y el otro se une
                                (conectados).
                            </li>
                            <li>Los dos tienen los mismos 24 personajes. Cada quien elige uno secreto.</li>
                            <li>
                                Por turnos, hagan preguntas de sí o no: «¿Es mujer?», «¿Usa sombrero?». Para contestar,
                                revisa la ficha de tu personaje.
                            </li>
                            <li>Toca a los personajes que ya no pueden ser para bajarlos.</li>
                            <li>
                                Cuando creas saber quién es, toca <b className="text-neutral-200">Adivinar</b>. Si
                                aciertas ganas; si fallas, pierdes.
                            </li>
                        </motion.ol>
                    )}
                </AnimatePresence>
            </section>
        </div>
    )
}
