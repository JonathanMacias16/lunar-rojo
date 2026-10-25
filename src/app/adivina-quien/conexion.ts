// Conexión directa entre los dos celulares con PeerJS (WebRTC).
// El servidor gratuito de PeerJS solo sirve para que se encuentren; los mensajes
// del juego viajan directo de un cel al otro.
import type { DataConnection, Peer, PeerError } from "peerjs"
import type { Mensaje, Rol } from "./juego"

export type EstadoConexion =
    | "conectando" // abriendo la sala o buscando al anfitrión
    | "esperando" // la sala está abierta y nadie se ha conectado (o se fue)
    | "conectado"
    | "buscando" // el invitado no encuentra la sala todavía
    | "sin-servidor" // no se pudo llegar al servidor de PeerJS
    | "no-compatible"

const PREFIJO = "lunar-rojo-adivina-quien-"
const LATIDO = 4000 // cada cuánto se avisan que siguen ahí
const SIN_LATIDO = 15000 // si pasa esto sin saber del otro, se da por perdido
const ESPERA_CONEXION = 15000

type Opciones = {
    codigo: string
    rol: Rol
    alMensaje: (m: Mensaje) => void
    alConectar: () => void
    alCambiar: (estado: EstadoConexion) => void
}

export function abrirConexion({ codigo, rol, alMensaje, alConectar, alCambiar }: Opciones) {
    let peer: Peer | null = null
    let conexion: DataConnection | null = null
    let intento: DataConnection | null = null // la llamada del invitado que todavía no contesta
    let cerrado = false
    let fallasServidor = 0
    let ultimoContacto = 0
    let estado: EstadoConexion = "conectando"
    let reintento: ReturnType<typeof setTimeout> | undefined
    let esperaConexion: ReturnType<typeof setTimeout> | undefined

    const cambiar = (nuevo: EstadoConexion) => {
        if (nuevo === estado || cerrado) return
        estado = nuevo
        alCambiar(nuevo)
    }

    const programar = (accion: () => void, ms: number) => {
        clearTimeout(reintento)
        reintento = setTimeout(() => {
            if (!cerrado) accion()
        }, ms)
    }

    const destruirPeer = () => {
        clearTimeout(esperaConexion)
        conexion = null
        const viejo = peer
        peer = null
        viejo?.destroy()
    }

    const prepararConexion = (c: DataConnection) => {
        c.on("open", () => {
            if (cerrado) return c.close()
            clearTimeout(esperaConexion)
            if (conexion && conexion !== c) conexion.close()
            conexion = c
            ultimoContacto = Date.now()
            fallasServidor = 0
            cambiar("conectado")
            alConectar()
        })
        c.on("data", (datos) => {
            if (c !== conexion) return
            ultimoContacto = Date.now()
            const m = datos as Mensaje
            if (m && typeof m === "object" && typeof m.t === "string") alMensaje(m)
        })
        const alCerrar = () => {
            if (c !== conexion) return
            conexion = null
            if (rol === "anfitrion") cambiar("esperando")
            else {
                cambiar("conectando")
                programar(buscarAnfitrion, 1500)
            }
        }
        c.on("close", alCerrar)
        c.on("error", alCerrar)
    }

    // El invitado llama a la sala del anfitrión
    const buscarAnfitrion = () => {
        if (!peer || peer.destroyed || conexion?.open) return
        if (peer.disconnected) {
            peer.reconnect()
            return
        }
        if (intento && !intento.open) intento.close()
        const c = peer.connect(PREFIJO + codigo, { reliable: true, serialization: "json" })
        intento = c
        prepararConexion(c)
        clearTimeout(esperaConexion)
        esperaConexion = setTimeout(() => {
            // No se abrió a tiempo: se intenta de nuevo
            if (c.open || cerrado) return
            c.close()
            programar(buscarAnfitrion, 500)
        }, ESPERA_CONEXION)
    }

    const alError = (err: PeerError<string>) => {
        if (cerrado) return
        switch (err.type) {
            case "peer-unavailable":
                // La sala todavía no existe (o el anfitrión cerró la página): se sigue buscando
                cambiar("buscando")
                programar(buscarAnfitrion, 3000)
                return
            case "unavailable-id":
                // La sala sigue a nombre de una visita anterior de este mismo cel; se libera sola
                cambiar("conectando")
                destruirPeer()
                programar(iniciar, 4000)
                return
            case "browser-incompatible":
                cambiar("no-compatible")
                return
            case "disconnected":
            case "network":
            case "server-error":
            case "socket-error":
            case "socket-closed": {
                fallasServidor += 1
                if (fallasServidor >= 3 && !conexion?.open) cambiar("sin-servidor")
                // Si ya hay conexión con el otro cel, el juego sigue aunque se caiga el servidor
                if (conexion?.open) {
                    programar(() => peer?.disconnected && !peer.destroyed && peer.reconnect(), 5000)
                    return
                }
                destruirPeer()
                programar(iniciar, Math.min(2000 * fallasServidor, 10000))
                return
            }
            default:
                // Algo falló al conectar con el otro cel; el invitado vuelve a intentar
                if (rol === "invitado" && !conexion?.open) programar(buscarAnfitrion, 3000)
        }
    }

    const iniciar = async () => {
        let ClasePeer: typeof Peer
        try {
            ClasePeer = (await import("peerjs")).Peer
        } catch {
            fallasServidor += 1
            cambiar(fallasServidor >= 3 ? "sin-servidor" : "conectando")
            programar(iniciar, 3000)
            return
        }
        if (cerrado || peer) return

        const nuevo = rol === "anfitrion" ? new ClasePeer(PREFIJO + codigo) : new ClasePeer()
        peer = nuevo
        nuevo.on("open", () => {
            if (nuevo !== peer) return
            if (rol === "anfitrion") {
                fallasServidor = 0
                if (!conexion?.open) cambiar("esperando")
            } else buscarAnfitrion()
        })
        nuevo.on("connection", (c) => {
            if (nuevo !== peer || rol !== "anfitrion") return c.close()
            prepararConexion(c)
        })
        nuevo.on("disconnected", () => {
            // Se perdió el servidor; la conexión con el otro cel puede seguir viva
            if (nuevo === peer && !cerrado) programar(() => !nuevo.destroyed && nuevo.reconnect(), 2000)
        })
        nuevo.on("error", (err) => {
            if (nuevo === peer) alError(err)
        })
    }

    // Latido: así se nota rápido si el otro cel se durmió o perdió la señal
    const latido = setInterval(() => {
        if (!conexion?.open) return
        try {
            conexion.send({ t: "ping" } satisfies Mensaje)
        } catch {
            // Se cerró justo ahora; lo atiende el aviso de cierre
        }
        if (Date.now() - ultimoContacto > SIN_LATIDO) {
            const perdida = conexion
            conexion = null
            perdida.close()
            if (rol === "anfitrion") cambiar("esperando")
            else {
                cambiar("conectando")
                programar(buscarAnfitrion, 500)
            }
        }
    }, LATIDO)

    // Al volver a la página (el cel se bloqueó o cambiaron de app) se revisa todo
    const alVolver = () => {
        if (document.visibilityState !== "visible" || cerrado) return
        if (!peer || peer.destroyed) {
            destruirPeer()
            iniciar()
        } else if (peer.disconnected) peer.reconnect()
        else if (rol === "invitado" && !conexion?.open) buscarAnfitrion()
    }
    document.addEventListener("visibilitychange", alVolver)

    alCambiar(estado)
    iniciar()

    return {
        enviar: (m: Mensaje) => {
            if (!conexion?.open) return false
            try {
                conexion.send(m)
                return true
            } catch {
                return false
            }
        },
        reintentar: () => {
            fallasServidor = 0
            cambiar("conectando")
            destruirPeer()
            programar(iniciar, 0)
        },
        cerrar: () => {
            cerrado = true
            clearTimeout(reintento)
            clearInterval(latido)
            document.removeEventListener("visibilitychange", alVolver)
            destruirPeer()
        },
    }
}
