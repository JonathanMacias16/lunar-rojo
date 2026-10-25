"use client"

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
    Check,
    Copy,
    Eye,
    EyeOff,
    Loader2,
    LogOut,
    Menu,
    RotateCcw,
    Send,
    Share2,
    Shuffle,
    Users,
    Volume2,
    VolumeX,
    WifiOff,
} from "lucide-react"
import clsx from "clsx"
import { Boton, Festejo, Ficha, Fondo, Hoja, Retrato, Tarjeta, TarjetaGrande, fuenteTerror } from "./componentes"
import { Inicio } from "./inicio"
import { abrirConexion, type EstadoConexion } from "./conexion"
import { crearMotor, esMiTurno, faseDe, nombreDe, tableroDe, type Motor, type Partida } from "./juego"
import { personaje, preguntas, tiene, type Personaje, type Rasgo } from "./personajes"
import { sonidos } from "./sonidos"

const sinPartida = () => null
const mayus = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1)
const vibrar = (patron: number | number[]) => {
    try {
        navigator.vibrate?.(patron)
    } catch {
        // No todos los celulares vibran
    }
}

// Sonido prendido o apagado, recordado en este cel
const CLAVE_SONIDO = "adivina-quien:sonido"
const avisosSonido = new Set<() => void>()
const leerSonido = () => {
    try {
        return localStorage.getItem(CLAVE_SONIDO) !== "0"
    } catch {
        return true
    }
}
const guardarSonido = (si: boolean) => {
    try {
        localStorage.setItem(CLAVE_SONIDO, si ? "1" : "0")
    } catch {
        // Sin almacenamiento dura solo esta visita
    }
    avisosSonido.forEach((avisar) => avisar())
}
const suscribirSonido = (avisar: () => void) => {
    avisosSonido.add(avisar)
    return () => {
        avisosSonido.delete(avisar)
    }
}

export default function AdivinaQuienPage() {
    const [motor] = useState(crearMotor)
    const partida = useSyncExternalStore(motor.suscribir, motor.leer, sinPartida)
    const guardada = useSyncExternalStore(motor.suscribir, motor.guardada, sinPartida)
    const sonido = useSyncExternalStore(suscribirSonido, leerSonido, () => true)
    const [conexion, setConexion] = useState<EstadoConexion>("conectando")
    const reintentarRef = useRef<() => void>(() => { })

    useEffect(() => {
        sonidos.activar(sonido)
    }, [sonido])

    // Solo hay conexión mientras se juega en línea
    const online = partida?.modo === "online"
    const codigo = partida?.codigo
    const rol = partida?.rol
    useEffect(() => {
        if (!online || !codigo || !rol) return
        const c = abrirConexion({
            codigo,
            rol,
            alMensaje: motor.recibir,
            alConectar: motor.alConectar,
            alCambiar: setConexion,
        })
        motor.usarEnvio((m) => {
            c.enviar(m)
        })
        reintentarRef.current = c.reintentar
        return () => {
            motor.usarEnvio(() => { })
            reintentarRef.current = () => { }
            c.cerrar()
        }
    }, [online, codigo, rol, motor])

    const quitarSalaDelLink = () => {
        if (window.location.search) window.history.replaceState(null, "", window.location.pathname)
    }

    return (
        <main
            className="relative isolate min-h-dvh overflow-x-clip bg-[#0d0714] text-neutral-100"
            onPointerDown={() => sonidos.desbloquear()}
        >
            <Fondo />
            {partida ? (
                <EnPartida
                    key={`${partida.codigo}-${partida.rol}-${partida.modo}`}
                    motor={motor}
                    partida={partida}
                    conexion={conexion}
                    reintentar={() => reintentarRef.current()}
                    sonido={sonido}
                    alternarSonido={() => guardarSonido(!sonido)}
                />
            ) : (
                <Inicio
                    guardada={guardada}
                    alCrear={(nombre) => {
                        quitarSalaDelLink()
                        motor.crear(nombre)
                    }}
                    alUnirse={(c, nombre) => {
                        quitarSalaDelLink()
                        motor.unirse(c, nombre)
                    }}
                    alJugarLocal={(c, nombre) => {
                        quitarSalaDelLink()
                        motor.jugarLocal(c, nombre)
                    }}
                    alContinuar={motor.continuar}
                    alOlvidar={motor.olvidarGuardada}
                />
            )}
        </main>
    )
}

type HojaAbierta = "preguntar" | "adivinar" | "menu" | "secreto" | "terminar" | null
type Respuesta = { texto: string; rasgo?: Rasgo; si: boolean }

function EnPartida({
    motor,
    partida,
    conexion,
    reintentar,
    sonido,
    alternarSonido,
}: {
    motor: Motor
    partida: Partida
    conexion: EstadoConexion
    reintentar: () => void
    sonido: boolean
    alternarSonido: () => void
}) {
    const fase = faseDe(partida)
    const local = partida.modo === "local"
    const rival = partida.rivalNombre || "tu rival"
    const Rival = mayus(rival)
    const tablero = tableroDe(partida)
    const bajadas = useMemo(() => new Set(partida.bajadas), [partida.bajadas])
    const quedan = tablero.filter((p) => !bajadas.has(p.id))
    const miTurno = esMiTurno(partida)
    const conectado = local || conexion === "conectado"
    const puedeJugar = fase === "jugando" && miTurno && !partida.pendiente && !partida.porResponder && conectado
    const secreto = personaje(partida.secreto)

    const [hoja, setHoja] = useState<HojaAbierta>(null)
    const [respuesta, setRespuesta] = useState<Respuesta | null>(null)
    const [ficha, setFicha] = useState<Personaje | null>(null)
    const [modoToque, setModoToque] = useState<"bajar" | "ficha">("bajar")
    const [toast, setToast] = useState<{ id: number; texto: string } | null>(null)
    const [tanda, setTanda] = useState<Map<string, number> | null>(null)
    const [mostrarSecreto, setMostrarSecreto] = useState(false)
    const [verTablero, setVerTablero] = useState(false)

    // Lo que llega del otro celular
    useEffect(
        () =>
            motor.usarAvisos((a) => {
                const j = motor.leer()
                const r = mayus(j?.rivalNombre || "tu rival")
                switch (a.tipo) {
                    case "respuesta":
                        setHoja(null)
                        setRespuesta(a)
                        if (a.si) sonidos.si()
                        else sonidos.no()
                        vibrar(60)
                        return
                    case "te-preguntaron":
                        setToast({ id: Date.now(), texto: `${r} preguntó «${a.texto}» → ${a.si ? "Sí" : "No"}. ¡Te toca!` })
                        sonidos.aviso()
                        vibrar([60, 80, 60])
                        return
                    case "pregunta-libre":
                        setHoja(null)
                        sonidos.aviso()
                        vibrar([60, 80, 60])
                        return
                    case "rival-listo":
                        setToast({ id: Date.now(), texto: `${r} ya eligió su personaje. ¡A jugar!` })
                        sonidos.aviso()
                        return
                    case "rival-conectado":
                        setToast({ id: Date.now(), texto: `${a.nombre ? mayus(a.nombre) : "Tu rival"} entró a la partida` })
                        sonidos.fantasma()
                        vibrar(80)
                        return
                    case "final":
                        setHoja(null)
                        setRespuesta(null)
                        setVerTablero(false)
                        if (a.gane) sonidos.ganar()
                        else sonidos.perder()
                        vibrar(a.gane ? [80, 60, 80, 60, 200] : 300)
                        return
                }
            }),
        [motor]
    )

    useEffect(() => {
        if (!toast) return
        const t = setTimeout(() => setToast(null), 3800)
        return () => clearTimeout(t)
    }, [toast])

    // Que la pantalla no se apague a media partida (si se apaga, se cae la conexión)
    useEffect(() => {
        if (local || !("wakeLock" in navigator)) return
        let candado: WakeLockSentinel | null = null
        let activo = true
        const pedir = async () => {
            if (document.visibilityState !== "visible") return
            try {
                const nuevo = await navigator.wakeLock.request("screen")
                if (activo) candado = nuevo
                else nuevo.release()
            } catch {
                // Sin permiso o sin batería: no pasa nada
            }
        }
        pedir()
        document.addEventListener("visibilitychange", pedir)
        return () => {
            activo = false
            document.removeEventListener("visibilitychange", pedir)
            candado?.release().catch(() => { })
        }
    }, [local])

    const tocar = (p: Personaje) => {
        if (modoToque === "ficha" || fase === "fin") {
            setFicha(p)
            return
        }
        sonidos.voltear(!bajadas.has(p.id))
        motor.alternar(p.id)
    }

    // Baja varias de un jalón, una tras otra
    const bajarTanda = (ids: string[]) => {
        const paso = Math.min(70, 900 / Math.max(ids.length, 1))
        setTanda(new Map(ids.map((id, i) => [id, i * paso])))
        motor.bajar(ids)
        ids.slice(0, 10).forEach((_, i) => setTimeout(() => sonidos.voltear(true), i * paso * (ids.length / Math.min(ids.length, 10))))
        setTimeout(() => setTanda(null), ids.length * paso + 700)
    }

    const terminarLocal = (gane: boolean, adivinoYo: boolean, intento: string | null) => {
        setHoja(null)
        setVerTablero(false)
        motor.terminarLocal(gane, adivinoYo, intento)
        if (gane) sonidos.ganar()
        else sonidos.perder()
    }

    const revancha = () => {
        setVerTablero(false)
        setRespuesta(null)
        motor.revancha()
    }

    const encabezado = (
        <Encabezado
            partida={partida}
            conexion={conexion}
            sonido={sonido}
            alternarSonido={alternarSonido}
            abrirMenu={() => setHoja("menu")}
        />
    )

    const menu = (
        <Hoja abierta={hoja === "menu"} alCerrar={() => setHoja(null)} titulo="Menú">
            <ContenidoMenu
                partida={partida}
                rival={rival}
                conexion={conexion}
                alSinConexion={() => {
                    setHoja(null)
                    motor.seguirSinConexion()
                }}
                alTerminar={terminarLocal}
                alRevancha={() => {
                    setHoja(null)
                    revancha()
                }}
                alSalir={motor.salir}
            />
        </Hoja>
    )

    if (fase === "sala") {
        return (
            <>
                {encabezado}
                <Sala
                    partida={partida}
                    conexion={conexion}
                    reintentar={reintentar}
                    alSinConexion={motor.seguirSinConexion}
                    alCancelar={motor.salir}
                />
                {menu}
            </>
        )
    }

    if (fase === "eligiendo") {
        return (
            <>
                {encabezado}
                <Elegir key={partida.ronda} motor={motor} partida={partida} rival={rival} />
                {menu}
                <Avisito toast={toast} />
            </>
        )
    }

    const final = partida.final
    const ultima = [...partida.historial].reverse().find((r) => r.quien === "yo" && r.respuesta !== null)

    let banner: { tono: "turno" | "espera" | "alerta" | "info"; texto: string; detalle?: string }
    if (fase === "fin" && final) {
        banner = { tono: "info", texto: final.gane ? "¡Ganaste esta ronda! 🎉" : "Perdiste esta ronda 💀" }
    } else if (!conectado) {
        banner = {
            tono: "alerta",
            texto:
                conexion === "sin-servidor"
                    ? "No hay internet o el servidor no responde."
                    : `Se perdió la conexión con ${rival}. Reconectando…`,
        }
    } else if (fase === "esperando-rival") {
        banner = { tono: "espera", texto: `Esperando a que ${rival} elija su personaje…` }
    } else if (local) {
        banner = { tono: "info", texto: "En persona: pregúntense por turnos en voz alta." }
    } else if (partida.pendiente?.tipo === "pregunta") {
        banner = { tono: "espera", texto: `Esperando la respuesta de ${rival}…`, detalle: `«${partida.pendiente.texto}»` }
    } else if (partida.pendiente?.tipo === "adivinar") {
        banner = { tono: "espera", texto: `¿Será ${nombreDe(partida.pendiente.personaje)}? Ya veremos…` }
    } else if (partida.porResponder) {
        banner = { tono: "turno", texto: `${Rival} te hizo una pregunta` }
    } else if (miTurno) {
        banner = { tono: "turno", texto: "¡Tu turno! Pregunta algo o adivina." }
    } else {
        banner = { tono: "espera", texto: `Turno de ${rival}. Ya te va a preguntar algo…` }
    }

    return (
        <>
            {encabezado}

            <div className="relative z-10 mx-auto max-w-3xl px-3 pb-36 pt-3">
                <div className="mb-3 flex items-center justify-between gap-3 text-xs text-neutral-400">
                    <span>
                        Ronda {partida.ronda} ·{" "}
                        <span className="font-semibold text-neutral-200">
                            Tú {partida.marcador.yo} – {partida.marcador.rival} {Rival}
                        </span>
                    </span>
                    <span className="text-right">
                        Te quedan <b className="text-orange-300">{quedan.length}</b>
                        {!local && partida.rivalQuedan !== null && (
                            <>
                                {" "}
                                · a {rival} <b className="text-purple-300">{partida.rivalQuedan}</b>
                            </>
                        )}
                    </span>
                </div>

                <motion.div
                    key={banner.texto}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="status"
                    className={clsx(
                        "mb-3 rounded-2xl border px-4 py-3 text-sm",
                        banner.tono === "turno" &&
                        "border-orange-500/50 bg-orange-500/15 font-semibold text-orange-100 shadow-[0_0_24px_-8px_rgba(249,115,22,0.7)]",
                        banner.tono === "espera" && "border-purple-400/20 bg-purple-500/10 text-purple-100",
                        banner.tono === "alerta" && "border-amber-400/40 bg-amber-500/10 text-amber-100",
                        banner.tono === "info" && "border-white/10 bg-white/[0.04] text-neutral-200"
                    )}
                >
                    <div className="flex items-center gap-2">
                        {banner.tono === "espera" && <Loader2 className="size-4 shrink-0 animate-spin opacity-70" />}
                        {banner.tono === "alerta" && <WifiOff className="size-4 shrink-0" />}
                        <span className="min-w-0 flex-1">{banner.texto}</span>
                        {fase === "fin" && (
                            <button
                                type="button"
                                onClick={revancha}
                                className="shrink-0 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-[#1a0b02] cursor-pointer"
                            >
                                Revancha
                            </button>
                        )}
                        {local && fase === "jugando" && (
                            <button
                                type="button"
                                onClick={() => setHoja("terminar")}
                                className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-xs font-semibold cursor-pointer"
                            >
                                ¿Te adivinaron?
                            </button>
                        )}
                        {banner.tono === "alerta" && (
                            <button
                                type="button"
                                onClick={motor.seguirSinConexion}
                                className="shrink-0 rounded-full border border-amber-300/40 px-3 py-1 text-xs font-semibold cursor-pointer"
                            >
                                Seguir sin conexión
                            </button>
                        )}
                    </div>
                    {banner.detalle && <p className="mt-1 break-words pl-6 text-purple-200/80">{banner.detalle}</p>}
                    {!banner.detalle && ultima && fase === "jugando" && (
                        <p className="mt-1 text-xs font-normal text-neutral-400">
                            Tu última pregunta: {ultima.texto} →{" "}
                            <b className={ultima.respuesta ? "text-lime-400" : "text-rose-400"}>
                                {ultima.respuesta ? "Sí" : "No"}
                            </b>
                        </p>
                    )}
                </motion.div>

                <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-neutral-500">
                        {modoToque === "bajar" ? "Toca a los que ya no pueden ser" : "Toca uno para ver su ficha"}
                    </p>
                    <div className="flex rounded-full border border-white/10 bg-white/[0.04] p-0.5 text-xs">
                        {(["bajar", "ficha"] as const).map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setModoToque(m)}
                                aria-pressed={modoToque === m}
                                className={clsx(
                                    "rounded-full px-3 py-1.5 transition-colors cursor-pointer",
                                    modoToque === m ? "bg-white/15 text-white" : "text-neutral-400"
                                )}
                            >
                                {m === "bajar" ? "Bajar" : "Ver ficha"}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3">
                    {tablero.map((p) => (
                        <Tarjeta
                            key={p.id}
                            p={p}
                            bajada={bajadas.has(p.id)}
                            retraso={tanda?.get(p.id) ?? 0}
                            alTocar={() => tocar(p)}
                        />
                    ))}
                </div>
            </div>

            {/* Barra de abajo: tu personaje y las acciones */}
            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0d0714]/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md">
                <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 pt-3">
                    <button
                        type="button"
                        onClick={() => setHoja("secreto")}
                        aria-label="Ver tu personaje secreto"
                        className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-1.5 text-left transition-colors hover:bg-white/10 cursor-pointer min-[400px]:pr-3"
                    >
                        {mostrarSecreto && secreto ? (
                            <Retrato p={secreto} className="size-10 rounded-xl text-2xl" />
                        ) : (
                            <span className="grid size-10 place-items-center rounded-xl bg-[#2a1636] text-2xl">🤫</span>
                        )}
                        <span className="hidden leading-tight min-[400px]:block">
                            <span className="block text-[10px] uppercase tracking-wider text-neutral-500">Tu personaje</span>
                            <span className="block max-w-[7rem] truncate text-sm font-semibold">
                                {mostrarSecreto && secreto ? secreto.nombre : "Toca para ver"}
                            </span>
                        </span>
                    </button>
                    <Boton className="flex-1 px-3" disabled={!puedeJugar} onClick={() => setHoja("preguntar")}>
                        Preguntar
                    </Boton>
                    <Boton
                        variante="secundario"
                        className="px-4"
                        disabled={!puedeJugar}
                        onClick={() => setHoja("adivinar")}
                    >
                        Adivinar
                    </Boton>
                </div>
            </div>

            <Hoja abierta={hoja === "preguntar"} alCerrar={() => setHoja(null)} titulo="Preguntar">
                <ContenidoPreguntar
                    partida={partida}
                    rival={rival}
                    alPreguntar={(texto, rasgo) => {
                        setHoja(null)
                        motor.preguntar(texto, rasgo)
                    }}
                    alAnotar={(texto, rasgo, si) => {
                        setHoja(null)
                        motor.anotar(texto, rasgo, si)
                        setRespuesta({ texto, rasgo, si })
                        if (si) sonidos.si()
                        else sonidos.no()
                    }}
                />
            </Hoja>

            <Hoja abierta={hoja === "adivinar"} alCerrar={() => setHoja(null)} titulo="Adivinar">
                <ContenidoAdivinar
                    quedan={quedan}
                    local={local}
                    rival={rival}
                    alAdivinar={(id) => {
                        setHoja(null)
                        motor.adivinar(id)
                    }}
                    alTerminar={(gane, id) => terminarLocal(gane, true, id)}
                />
            </Hoja>

            <Hoja abierta={respuesta !== null} alCerrar={() => setRespuesta(null)} titulo="Respuesta">
                {respuesta && (
                    <ContenidoRespuesta
                        respuesta={respuesta}
                        quedan={quedan}
                        quien={local ? "Tu rival dijo" : `${Rival} contestó`}
                        alBajar={(ids) => {
                            setRespuesta(null)
                            bajarTanda(ids)
                        }}
                        alCerrar={() => setRespuesta(null)}
                    />
                )}
            </Hoja>

            <Hoja abierta={hoja === "secreto"} alCerrar={() => setHoja(null)} titulo="Tu personaje secreto">
                {secreto && (
                    <div className="text-center">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-purple-300/80">
                            Tu personaje secreto
                        </p>
                        <TarjetaGrande p={secreto} />
                        <p className="mx-auto mt-4 max-w-xs text-xs text-neutral-400">
                            {local
                                ? "Contesta lo que te pregunten con esta ficha, así no hay pleitos."
                                : "Las preguntas de la lista se contestan solas con esta ficha."}
                        </p>
                        <div className="mt-3 text-left">
                            <Ficha p={secreto} />
                        </div>
                        <Boton variante="secundario" className="mt-4 w-full" onClick={() => setMostrarSecreto((v) => !v)}>
                            {mostrarSecreto ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                            {mostrarSecreto ? "Ocultarlo en la barra" : "Dejarlo a la vista en la barra"}
                        </Boton>
                    </div>
                )}
            </Hoja>

            <Hoja abierta={ficha !== null} alCerrar={() => setFicha(null)} titulo="Ficha del personaje">
                {ficha && (
                    <div className="text-center">
                        <TarjetaGrande p={ficha} />
                        <div className="mt-4 text-left">
                            <Ficha p={ficha} />
                        </div>
                        {fase !== "fin" && (
                            <Boton
                                variante="secundario"
                                className="mt-4 w-full"
                                onClick={() => {
                                    setFicha(null)
                                    sonidos.voltear(!bajadas.has(ficha.id))
                                    motor.alternar(ficha.id)
                                }}
                            >
                                {bajadas.has(ficha.id) ? "Volver a subirlo" : "Bajarlo"}
                            </Boton>
                        )}
                    </div>
                )}
            </Hoja>

            {menu}

            <Hoja abierta={hoja === "terminar"} alCerrar={() => setHoja(null)} titulo="Cómo terminó la ronda">
                <ContenidoTerminar rival={rival} alTerminar={terminarLocal} alVolver={() => setHoja(null)} />
            </Hoja>

            {/* El rival hizo una pregunta propia: hay que contestarla */}
            <Hoja
                abierta={partida.porResponder !== null && fase === "jugando" && !local}
                cerrable={false}
                titulo="Te hicieron una pregunta"
            >
                {partida.porResponder && (
                    <div className="text-center">
                        <p className="text-sm text-neutral-400">{Rival} te pregunta:</p>
                        <p className="mt-2 break-words text-2xl font-semibold leading-snug">
                            «{partida.porResponder.texto}»
                        </p>
                        {secreto && (
                            <div className="mx-auto mt-5 flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-2 pr-4 text-left">
                                <Retrato p={secreto} className="size-12 rounded-xl text-3xl" />
                                <span className="leading-tight">
                                    <span className="block text-[10px] uppercase tracking-wider text-neutral-500">
                                        Tu personaje
                                    </span>
                                    <span className="block font-semibold">{secreto.nombre}</span>
                                    <span className="block text-xs text-neutral-400">{secreto.de}</span>
                                </span>
                            </div>
                        )}
                        <div className="mt-6 grid grid-cols-2 gap-2">
                            <Boton variante="si" onClick={() => motor.responder(true)}>
                                Sí
                            </Boton>
                            <Boton variante="no" onClick={() => motor.responder(false)}>
                                No
                            </Boton>
                        </div>
                    </div>
                )}
            </Hoja>

            <Hoja
                abierta={fase === "fin" && final !== null && !verTablero}
                alCerrar={() => setVerTablero(true)}
                titulo={final?.gane ? "Ganaste" : "Perdiste"}
            >
                {final && (
                    <ContenidoFinal
                        partida={partida}
                        rival={rival}
                        alRevancha={revancha}
                        alVerTablero={() => setVerTablero(true)}
                        alSalir={motor.salir}
                    />
                )}
            </Hoja>
            {fase === "fin" && final?.gane && !verTablero && <Festejo key={partida.ronda} />}

            <Avisito toast={toast} />
        </>
    )
}

function Avisito({ toast }: { toast: { id: number; texto: string } | null }) {
    return (
        <div className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+4.25rem)] z-[70] flex justify-center px-4">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        key={toast.id}
                        role="status"
                        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#25143a]/95 px-4 py-3 text-center text-sm text-neutral-100 shadow-xl backdrop-blur"
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                    >
                        {toast.texto}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function Encabezado({
    partida,
    conexion,
    sonido,
    alternarSonido,
    abrirMenu,
}: {
    partida: Partida
    conexion: EstadoConexion
    sonido: boolean
    alternarSonido: () => void
    abrirMenu: () => void
}) {
    const local = partida.modo === "local"
    const color = local
        ? "bg-neutral-500"
        : conexion === "conectado"
            ? "bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]"
            : conexion === "sin-servidor" || conexion === "no-compatible"
                ? "bg-rose-500"
                : "bg-amber-400 animate-pulse"
    const estado = local
        ? "En persona"
        : conexion === "conectado"
            ? "Conectado"
            : conexion === "sin-servidor"
                ? "Sin servidor"
                : "Conectando"

    return (
        <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0d0714]/80 pt-[env(safe-area-inset-top)] backdrop-blur-md">
            <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 py-2">
                <span className="truncate text-2xl leading-none text-orange-500" style={fuenteTerror}>
                    Adivina Quién
                </span>
                <div className="ml-auto flex shrink-0 items-center gap-1">
                    <span
                        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 font-mono text-xs tracking-widest text-neutral-200"
                        title={estado}
                    >
                        {local ? <Users className="size-3 text-neutral-400" /> : <span className={clsx("size-2 rounded-full", color)} />}
                        <span className="sr-only">{estado}, código </span>
                        {partida.codigo}
                    </span>
                    <button
                        type="button"
                        onClick={alternarSonido}
                        aria-label={sonido ? "Silenciar" : "Activar sonido"}
                        className="grid size-10 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-200 cursor-pointer"
                    >
                        {sonido ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
                    </button>
                    <button
                        type="button"
                        onClick={abrirMenu}
                        aria-label="Menú"
                        className="grid size-10 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-200 cursor-pointer"
                    >
                        <Menu className="size-5" />
                    </button>
                </div>
            </div>
        </header>
    )
}

const linkDe = (codigo: string) => `${window.location.origin}/adivina-quien?sala=${codigo}`

function useCompartir(codigo: string) {
    const [copiado, setCopiado] = useState(false)
    useEffect(() => {
        if (!copiado) return
        const t = setTimeout(() => setCopiado(false), 2200)
        return () => clearTimeout(t)
    }, [copiado])

    const compartir = async () => {
        const link = linkDe(codigo)
        const texto = `¡Juega Adivina Quién de Halloween conmigo! 🎃 Código: ${codigo}`
        if (navigator.share) {
            try {
                await navigator.share({ title: "Adivina Quién: Halloween", text: texto, url: link })
                return
            } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") return
            }
        }
        try {
            await navigator.clipboard.writeText(`${texto} ${link}`)
            setCopiado(true)
        } catch {
            // Sin portapapeles: el código está a la vista
        }
    }

    const copiarCodigo = async () => {
        try {
            await navigator.clipboard.writeText(codigo)
            setCopiado(true)
        } catch {
            // Sin portapapeles: el código está a la vista
        }
    }

    return { copiado, compartir, copiarCodigo }
}

function Sala({
    partida,
    conexion,
    reintentar,
    alSinConexion,
    alCancelar,
}: {
    partida: Partida
    conexion: EstadoConexion
    reintentar: () => void
    alSinConexion: () => void
    alCancelar: () => void
}) {
    const anfitrion = partida.rol === "anfitrion"
    const { copiado, compartir, copiarCodigo } = useCompartir(partida.codigo)
    const problema = conexion === "sin-servidor" || conexion === "no-compatible"

    const estado =
        conexion === "no-compatible"
            ? "Este navegador no puede conectarse con otro cel."
            : conexion === "sin-servidor"
                ? "No pudimos conectarnos. Revisa tu internet."
                : anfitrion
                    ? conexion === "esperando"
                        ? "Esperando a que tu rival entre…"
                        : "Abriendo la sala…"
                    : conexion === "buscando"
                        ? "Buscando la partida…"
                        : "Conectando…"

    return (
        <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-md flex-col items-center justify-center px-6 py-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-300/80">
                {anfitrion ? "Pásale este código a tu rival" : "Entrando a la partida"}
            </p>
            <button
                type="button"
                onClick={copiarCodigo}
                aria-label={`Copiar el código ${partida.codigo}`}
                className="mt-3 rounded-3xl border border-orange-500/30 bg-orange-500/[0.07] px-6 py-4 font-mono text-6xl font-bold tracking-[0.2em] text-orange-300 shadow-[0_0_40px_-12px_rgba(249,115,22,0.8)] cursor-pointer"
            >
                {partida.codigo}
            </button>
            <p className="mt-2 h-4 text-xs text-neutral-500">{copiado ? "¡Copiado!" : anfitrion ? "Toca para copiarlo" : ""}</p>

            {anfitrion && (
                <Boton className="mt-4" onClick={compartir}>
                    {copiado ? <Check className="size-5" /> : <Share2 className="size-5" />} Mandar invitación
                </Boton>
            )}

            <p
                role="status"
                className={clsx(
                    "mt-8 flex items-center gap-2 text-sm",
                    problema ? "text-amber-200" : "text-neutral-300"
                )}
            >
                {!problema && <Loader2 className="size-4 animate-spin" />}
                {estado}
            </p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-neutral-500">
                {anfitrion
                    ? "Tu rival abre esta misma página en su cel, toca «Unirme con un código» y escribe el código."
                    : conexion === "buscando"
                        ? `Revisa que el código sea ${partida.codigo} y que tu rival tenga la partida abierta.`
                        : "Esto tarda unos segundos."}
            </p>

            <div className="mt-8 flex w-full flex-col gap-2">
                {problema && (
                    <Boton variante="secundario" onClick={reintentar}>
                        <RotateCcw className="size-5" /> Reintentar
                    </Boton>
                )}
                <Boton variante="secundario" onClick={alSinConexion}>
                    <Users className="size-5" /> Jugar en persona
                </Boton>
                <p className="text-xs text-neutral-500">
                    Si están juntos no hace falta internet: tu rival toca «Jugar en persona» con el código{" "}
                    {partida.codigo} y les sale el mismo tablero.
                </p>
                <Boton variante="fantasma" className="mt-2" onClick={alCancelar}>
                    Cancelar
                </Boton>
            </div>
        </div>
    )
}

function Elegir({ motor, partida, rival }: { motor: Motor; partida: Partida; rival: string }) {
    const tablero = tableroDe(partida)
    const [candidato, setCandidato] = useState(
        () => partida.secreto ?? tablero[Math.floor(Math.random() * tablero.length)].id
    )
    const [lista, setLista] = useState(false)
    const p = personaje(candidato) ?? tablero[0]

    const otro = () => {
        const opciones = tablero.filter((x) => x.id !== candidato)
        setCandidato(opciones[Math.floor(Math.random() * opciones.length)].id)
        sonidos.voltear(false)
    }

    const listo = () => {
        motor.elegirSecreto(candidato)
        motor.confirmarSecreto()
        sonidos.fantasma()
    }

    return (
        <div className="relative z-10 mx-auto max-w-md px-5 pb-12 pt-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-300/80">Ronda {partida.ronda}</p>
            <h2 className="mt-1 text-[2.6rem] leading-none text-orange-500" style={fuenteTerror}>
                Tu personaje secreto
            </h2>
            <p className="mx-auto mt-3 max-w-xs text-sm text-neutral-400">
                {mayus(rival)} tiene que adivinar quién es. ¡Que no lo vea!
            </p>

            <div className="mt-6" style={{ perspective: 900 }}>
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={candidato}
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <TarjetaGrande p={p} />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
                <Boton variante="secundario" onClick={otro}>
                    <Shuffle className="size-5" /> Otro
                </Boton>
                <Boton variante="secundario" onClick={() => setLista(true)}>
                    Elegir yo
                </Boton>
            </div>
            <Boton className="mt-3 w-full" onClick={listo}>
                ¡Este es!
            </Boton>
            <p className="mt-4 text-xs text-neutral-500">
                Sale de los 24 del tablero. En la barra de abajo lo puedes volver a ver cuando quieras.
            </p>

            <Hoja abierta={lista} alCerrar={() => setLista(false)} titulo="Elige tu personaje">
                <p className="mb-4 text-center text-sm font-semibold">¿Quién quieres ser?</p>
                <div className="grid grid-cols-4 gap-2">
                    {tablero.map((x) => (
                        <Tarjeta
                            key={x.id}
                            p={x}
                            marcada={x.id === candidato}
                            alTocar={() => {
                                setCandidato(x.id)
                                setLista(false)
                            }}
                        />
                    ))}
                </div>
            </Hoja>
        </div>
    )
}

function ContenidoPreguntar({
    partida,
    rival,
    alPreguntar,
    alAnotar,
}: {
    partida: Partida
    rival: string
    alPreguntar: (texto: string, rasgo?: Rasgo) => void
    alAnotar: (texto: string, rasgo: Rasgo, si: boolean) => void
}) {
    const local = partida.modo === "local"
    const [libre, setLibre] = useState("")
    const [elegida, setElegida] = useState<{ rasgo: Rasgo; texto: string } | null>(null)
    const hechas = new Map<Rasgo, boolean | null>()
    for (const r of partida.historial) if (r.quien === "yo" && r.rasgo) hechas.set(r.rasgo, r.respuesta)

    const enviarLibre = (e: FormEvent) => {
        e.preventDefault()
        if (libre.trim()) alPreguntar(libre)
    }

    // Sin conexión: primero qué preguntaste, luego qué te dijeron
    if (local && elegida) {
        return (
            <div className="text-center">
                <p className="text-sm text-neutral-400">Pregúntale en voz alta:</p>
                <p className="mt-2 text-2xl font-semibold">{elegida.texto}</p>
                <p className="mt-5 text-sm text-neutral-400">¿Qué te contestó?</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                    <Boton variante="si" onClick={() => alAnotar(elegida.texto, elegida.rasgo, true)}>
                        Sí
                    </Boton>
                    <Boton variante="no" onClick={() => alAnotar(elegida.texto, elegida.rasgo, false)}>
                        No
                    </Boton>
                </div>
                <Boton variante="fantasma" className="mt-2 w-full" onClick={() => setElegida(null)}>
                    Otra pregunta
                </Boton>
            </div>
        )
    }

    return (
        <div>
            <p className="pr-8 text-lg font-semibold">{local ? "¿Qué le vas a preguntar?" : `¿Qué le preguntas a ${rival}?`}</p>
            <p className="mt-1 text-xs text-neutral-400">
                {local
                    ? "Elige una y te ayudo a bajar a los que no sean."
                    : "Estas se contestan solas con la ficha de su personaje."}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
                {preguntas.map((q) => {
                    const hecha = hechas.get(q.rasgo)
                    const yaSabe = hecha !== undefined && hecha !== null
                    return (
                        <button
                            key={q.rasgo}
                            type="button"
                            disabled={yaSabe}
                            onClick={() => (local ? setElegida(q) : alPreguntar(q.texto, q.rasgo))}
                            className="flex min-h-12 items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-left text-sm leading-tight transition-colors hover:bg-white/10 disabled:opacity-45 cursor-pointer disabled:cursor-default"
                        >
                            <span>{q.texto}</span>
                            {yaSabe && (
                                <span className={clsx("shrink-0 text-xs font-bold", hecha ? "text-lime-400" : "text-rose-400")}>
                                    {hecha ? "Sí" : "No"}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            {local ? (
                <p className="mt-4 text-xs text-neutral-500">
                    ¿Otra pregunta? Hazla en voz alta y baja tú a los que no sean.
                </p>
            ) : (
                <form onSubmit={enviarLibre} className="mt-5">
                    <label htmlFor="pregunta-libre" className="text-xs text-neutral-400">
                        O escribe la tuya (la contesta {rival}):
                    </label>
                    <div className="mt-1.5 flex gap-2">
                        <input
                            id="pregunta-libre"
                            value={libre}
                            onChange={(e) => setLibre(e.target.value)}
                            maxLength={140}
                            placeholder="¿Tiene el pelo rojo?"
                            enterKeyHint="send"
                            autoComplete="off"
                            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-base outline-none placeholder:text-neutral-600 focus:border-orange-500/60"
                        />
                        <Boton type="submit" className="px-4" disabled={!libre.trim()} aria-label="Enviar pregunta">
                            <Send className="size-5" />
                        </Boton>
                    </div>
                </form>
            )}
        </div>
    )
}

function ContenidoAdivinar({
    quedan,
    local,
    rival,
    alAdivinar,
    alTerminar,
}: {
    quedan: Personaje[]
    local: boolean
    rival: string
    alAdivinar: (id: string) => void
    alTerminar: (gane: boolean, id: string) => void
}) {
    const [elegido, setElegido] = useState<string | null>(quedan.length === 1 ? quedan[0].id : null)
    const [preguntando, setPreguntando] = useState(false)
    const p = personaje(elegido)

    if (local && preguntando && p) {
        return (
            <div className="text-center">
                <p className="text-sm text-neutral-400">Pregúntale a {rival}:</p>
                <p className="mt-2 text-2xl font-semibold">¿Es {p.nombre}?</p>
                <div className="mt-6 grid grid-cols-2 gap-2">
                    <Boton variante="si" onClick={() => alTerminar(true, p.id)}>
                        ¡Sí! Gané
                    </Boton>
                    <Boton variante="no" onClick={() => alTerminar(false, p.id)}>
                        No, perdí
                    </Boton>
                </div>
                <Boton variante="fantasma" className="mt-2 w-full" onClick={() => setPreguntando(false)}>
                    Mejor no
                </Boton>
            </div>
        )
    }

    return (
        <div>
            <p className="pr-8 text-lg font-semibold">¿Quién es el personaje de {rival}?</p>
            <p className="mt-1 text-xs text-amber-200/80">Si fallas, pierdes la ronda.</p>
            <div className="mt-4 grid grid-cols-4 gap-2">
                {quedan.map((x) => (
                    <Tarjeta key={x.id} p={x} marcada={x.id === elegido} alTocar={() => setElegido(x.id)} />
                ))}
            </div>
            {quedan.length === 0 && (
                <p className="py-6 text-center text-sm text-neutral-400">Bajaste a todos. Sube a alguno primero.</p>
            )}
            <Boton
                className="mt-4 w-full"
                disabled={!p}
                onClick={() => {
                    if (!p) return
                    if (local) setPreguntando(true)
                    else alAdivinar(p.id)
                }}
            >
                {p ? `¿Es ${p.nombre}?` : "Elige a uno"}
            </Boton>
        </div>
    )
}

function ContenidoRespuesta({
    respuesta,
    quedan,
    quien,
    alBajar,
    alCerrar,
}: {
    respuesta: Respuesta
    quedan: Personaje[]
    quien: string
    alBajar: (ids: string[]) => void
    alCerrar: () => void
}) {
    const { rasgo, si } = respuesta
    const descartables = rasgo ? quedan.filter((p) => tiene(p.id, rasgo) !== si) : []

    return (
        <div className="text-center">
            <p className="text-sm text-neutral-400">{quien}</p>
            <p className="mt-1 break-words text-lg font-semibold">«{respuesta.texto}»</p>
            <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 260 }}
                className={clsx(
                    "mx-auto mt-4 w-fit rounded-3xl px-10 pb-2 pt-3 text-6xl leading-none",
                    si ? "bg-lime-500/15 text-lime-400" : "bg-rose-500/15 text-rose-400"
                )}
                style={fuenteTerror}
            >
                {si ? "SÍ" : "NO"}
            </motion.div>

            {rasgo ? (
                descartables.length > 0 ? (
                    <>
                        <p className="mt-5 text-sm text-neutral-300">
                            {descartables.length === 1
                                ? "Así que 1 de tus personajes ya no puede ser:"
                                : `Así que ${descartables.length} de tus personajes ya no pueden ser:`}
                        </p>
                        <div className="mx-auto mt-3 flex max-w-xs flex-wrap justify-center gap-1.5">
                            {descartables.map((p) => (
                                <span key={p.id} title={p.nombre}>
                                    <Retrato p={p} className="size-10 rounded-lg text-xl" />
                                </span>
                            ))}
                        </div>
                        <Boton className="mt-5 w-full" onClick={() => alBajar(descartables.map((p) => p.id))}>
                            Bajar {descartables.length === 1 ? "a ese" : `a los ${descartables.length}`}
                        </Boton>
                        <Boton variante="fantasma" className="mt-1 w-full" onClick={alCerrar}>
                            {descartables.length === 1 ? "Yo lo bajo" : "Yo los bajo"}
                        </Boton>
                    </>
                ) : (
                    <>
                        <p className="mt-5 text-sm text-neutral-300">Con esto no se descarta a ninguno de los que te quedan.</p>
                        <Boton className="mt-5 w-full" onClick={alCerrar}>
                            Ok
                        </Boton>
                    </>
                )
            ) : (
                <>
                    <p className="mt-5 text-sm text-neutral-300">Baja a los personajes que ya no pueden ser.</p>
                    <Boton className="mt-5 w-full" onClick={alCerrar}>
                        Ok
                    </Boton>
                </>
            )}
        </div>
    )
}

function ContenidoMenu({
    partida,
    rival,
    conexion,
    alSinConexion,
    alTerminar,
    alRevancha,
    alSalir,
}: {
    partida: Partida
    rival: string
    conexion: EstadoConexion
    alSinConexion: () => void
    alTerminar: (gane: boolean, adivinoYo: boolean, intento: string | null) => void
    alRevancha: () => void
    alSalir: () => void
}) {
    const local = partida.modo === "local"
    const [paso, setPaso] = useState<"menu" | "terminar" | "salir">("menu")
    const { copiado, compartir } = useCompartir(partida.codigo)
    const jugando = !partida.final && partida.listo

    if (paso === "salir") {
        return (
            <div className="text-center">
                <p className="text-lg font-semibold">¿Salir de la partida?</p>
                <p className="mt-1 text-sm text-neutral-400">Se borra el tablero y el marcador de este cel.</p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                    <Boton variante="secundario" onClick={() => setPaso("menu")}>
                        Quedarme
                    </Boton>
                    <Boton variante="no" onClick={alSalir}>
                        Salir
                    </Boton>
                </div>
            </div>
        )
    }

    if (paso === "terminar") {
        return <ContenidoTerminar rival={rival} alTerminar={alTerminar} alVolver={() => setPaso("menu")} />
    }

    return (
        <div>
            <p className="text-lg font-semibold">
                Partida <span className="font-mono tracking-widest text-orange-300">{partida.codigo}</span>
            </p>
            <p className="mt-0.5 text-sm text-neutral-400">
                Ronda {partida.ronda} · Tú {partida.marcador.yo} – {partida.marcador.rival} {mayus(rival)}
                {local ? " · en persona" : ""}
            </p>

            {partida.historial.length > 0 && (
                <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Preguntas de esta ronda</p>
                    <ul className="mt-2 space-y-1">
                        {partida.historial.map((r) => (
                            <li key={r.id} className="flex items-start justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2 text-sm">
                                <span className="min-w-0 break-words">
                                    <span className="text-neutral-500">{r.quien === "yo" ? "Tú" : mayus(rival)}: </span>
                                    {r.texto}
                                </span>
                                <span
                                    className={clsx(
                                        "shrink-0 font-semibold",
                                        r.respuesta === null ? "text-neutral-500" : r.respuesta ? "text-lime-400" : "text-rose-400"
                                    )}
                                >
                                    {r.respuesta === null ? "…" : r.respuesta ? "Sí" : "No"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-5 flex flex-col gap-2">
                {!local && (
                    <Boton variante="secundario" onClick={compartir}>
                        {copiado ? <Copy className="size-5" /> : <Share2 className="size-5" />}
                        {copiado ? "Invitación copiada" : "Mandar invitación otra vez"}
                    </Boton>
                )}
                {local && jugando && (
                    <Boton variante="secundario" onClick={() => setPaso("terminar")}>
                        Mi rival ya trató de adivinar…
                    </Boton>
                )}
                {local && (
                    <Boton variante="secundario" onClick={alRevancha}>
                        <RotateCcw className="size-5" /> Empezar otra ronda
                    </Boton>
                )}
                {!local && conexion !== "conectado" && (
                    <Boton variante="secundario" onClick={alSinConexion}>
                        <WifiOff className="size-5" /> Seguir sin conexión
                    </Boton>
                )}
                <Boton variante="fantasma" onClick={() => setPaso("salir")}>
                    <LogOut className="size-5" /> Salir de la partida
                </Boton>
            </div>
        </div>
    )
}

function ContenidoFinal({
    partida,
    rival,
    alRevancha,
    alVerTablero,
    alSalir,
}: {
    partida: Partida
    rival: string
    alRevancha: () => void
    alVerTablero: () => void
    alSalir: () => void
}) {
    const f = partida.final
    if (!f) return null
    const local = partida.modo === "local"
    const Rival = mayus(rival)
    const mio = personaje(f.miSecreto)
    const suyo = personaje(f.suSecreto)
    const intento = personaje(f.intento)

    let explicacion: string
    if (f.adivinoYo) {
        explicacion = f.gane
            ? `Adivinaste: era ${suyo?.nombre ?? intento?.nombre}.`
            : suyo
                ? `Era ${suyo.nombre}, no ${intento?.nombre}.`
                : `No era ${intento?.nombre}.`
    } else if (f.gane) {
        explicacion = intento ? `${Rival} dijo ${intento.nombre} y se equivocó.` : `${Rival} se equivocó.`
    } else {
        explicacion = local ? `${Rival} adivinó tu personaje.` : `${Rival} adivinó que eras ${mio?.nombre}.`
    }

    const cartita = (p: Personaje | undefined, etiqueta: string) => (
        <div className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500">{etiqueta}</span>
            {p ? (
                <Retrato p={p} className="size-16 rounded-2xl border border-white/15 text-4xl" />
            ) : (
                <span className="grid size-16 place-items-center rounded-2xl border border-white/15 bg-[#2a1636] text-4xl">
                    ❓
                </span>
            )}
            <span className="text-xs font-semibold leading-tight">{p?.nombre ?? "No sabemos"}</span>
        </div>
    )

    return (
        <div className="text-center">
            <motion.p
                className="text-6xl"
                initial={{ scale: 0.3, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 200 }}
                aria-hidden
            >
                {f.gane ? "🎉" : "💀"}
            </motion.p>
            <h2
                className={clsx("mt-2 text-5xl leading-none", f.gane ? "text-orange-500" : "text-purple-300")}
                style={fuenteTerror}
            >
                {f.gane ? "¡Ganaste!" : "Perdiste"}
            </h2>
            <p className="mt-3 text-sm text-neutral-300">{explicacion}</p>

            <div className="mt-5 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                {cartita(mio, "Tú eras")}
                {cartita(suyo, `${Rival} era`)}
            </div>

            <p className="mt-4 text-sm text-neutral-400">
                Marcador:{" "}
                <span className="font-semibold text-neutral-100">
                    Tú {partida.marcador.yo} – {partida.marcador.rival} {Rival}
                </span>
            </p>

            <Boton className="mt-5 w-full" onClick={alRevancha}>
                <RotateCcw className="size-5" /> Revancha
            </Boton>
            {local && (
                <p className="mt-2 text-xs text-neutral-500">
                    Tu rival también tiene que tocar Revancha para que les salga el mismo tablero.
                </p>
            )}
            <div className="mt-2 grid grid-cols-2 gap-2">
                <Boton variante="fantasma" onClick={alVerTablero}>
                    Ver tablero
                </Boton>
                <Boton variante="fantasma" onClick={alSalir}>
                    Salir
                </Boton>
            </div>
        </div>
    )
}

// En persona: cuando tu rival adivina (o falla) en su cel, aquí se anota
function ContenidoTerminar({
    rival,
    alTerminar,
    alVolver,
}: {
    rival: string
    alTerminar: (gane: boolean, adivinoYo: boolean, intento: string | null) => void
    alVolver: () => void
}) {
    return (
        <div className="text-center">
            <p className="text-lg font-semibold">¿{mayus(rival)} ya trató de adivinar?</p>
            <p className="mt-1 text-sm text-neutral-400">Si el que adivina eres tú, usa el botón Adivinar.</p>
            <div className="mt-5 flex flex-col gap-2">
                <Boton variante="no" onClick={() => alTerminar(false, false, null)}>
                    Sí, y adivinó mi personaje
                </Boton>
                <Boton variante="si" onClick={() => alTerminar(true, false, null)}>
                    Sí, pero se equivocó
                </Boton>
                <Boton variante="fantasma" onClick={alVolver}>
                    Todavía no
                </Boton>
            </div>
        </div>
    )
}
