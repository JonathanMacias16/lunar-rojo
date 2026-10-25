// Reglas y estado de una partida. No sabe nada de React ni de la conexión:
// recibe acciones, avisa cambios y deja los mensajes para el otro celular en `enviar`.
import { numeroDeTexto, personaje, tableroPara, tiene, type Rasgo } from "./personajes"

export type Modo = "online" | "local"
export type Rol = "anfitrion" | "invitado"

export type Registro = {
    id: string
    quien: "yo" | "rival"
    texto: string
    rasgo?: Rasgo
    respuesta: boolean | null
}

type Pendiente =
    | { tipo: "pregunta"; id: string; texto: string; rasgo?: Rasgo }
    | { tipo: "adivinar"; id: string; personaje: string }

export type Final = {
    gane: boolean
    adivinoYo: boolean
    intento: string | null // a quién dijeron
    miSecreto: string
    suSecreto: string | null
}

export type Partida = {
    version: 1
    modo: Modo
    rol: Rol
    codigo: string
    nombre: string
    rivalNombre: string | null // null mientras el rival no se ha conectado nunca
    ronda: number
    secreto: string | null
    listo: boolean
    rivalListo: boolean
    bajadas: string[]
    jugadas: number // preguntas ya contestadas en la ronda; de aquí sale de quién es el turno
    pendiente: Pendiente | null
    porResponder: { id: string; texto: string } | null
    ultimaRespondida: { id: string; si: boolean } | null
    historial: Registro[]
    rivalQuedan: number | null
    final: Final | null
    marcador: { yo: number; rival: number }
    actualizado: number
}

export type Mensaje =
    | { t: "hola"; nombre: string; ronda: number; listo: boolean; quedan: number }
    | { t: "ronda"; ronda: number }
    | { t: "listo"; ronda: number }
    | { t: "quedan"; ronda: number; n: number }
    | { t: "pregunta"; ronda: number; id: string; texto: string; rasgo?: Rasgo }
    | { t: "respuesta"; ronda: number; id: string; si: boolean }
    | { t: "adivinar"; ronda: number; id: string; personaje: string; miSecreto: string }
    | { t: "resultado"; ronda: number; id: string; acierto: boolean; suSecreto: string }
    | { t: "ping" }

// Cosas que la pantalla tiene que mostrar en el momento
export type Aviso =
    | { tipo: "respuesta"; texto: string; rasgo?: Rasgo; si: boolean }
    | { tipo: "te-preguntaron"; texto: string; si: boolean }
    | { tipo: "pregunta-libre" }
    | { tipo: "rival-listo" }
    | { tipo: "rival-conectado"; nombre: string }
    | { tipo: "final"; gane: boolean }

const CLAVE = "adivina-quien:partida"
const VIGENCIA = 12 * 60 * 60 * 1000 // una partida guardada sirve medio día

const LETRAS = "ABCDEFGHJKLMNPQRSTUVWXYZ" // sin I ni O para no confundirlas

export const nuevoCodigo = () => {
    const numeros = new Uint32Array(4)
    crypto.getRandomValues(numeros)
    return Array.from(numeros, (n) => LETRAS[n % LETRAS.length]).join("")
}

export const limpiarCodigo = (texto: string) =>
    texto
        .toUpperCase()
        .normalize("NFD")
        .replace(/[^A-Z]/g, "")
        .slice(0, 4)

const nuevoId = () => Math.random().toString(36).slice(2, 10)

export const tableroDe = (j: Pick<Partida, "codigo" | "ronda">) => tableroPara(j.codigo, j.ronda)

export const quedanDe = (j: Partida) => {
    const bajadas = new Set(j.bajadas)
    return tableroDe(j).filter((x) => !bajadas.has(x.id)).length
}

// La primera ronda la empieza alguien al azar (según el código) y luego se turnan
const empiezaAnfitrion = (codigo: string, ronda: number) => (numeroDeTexto(codigo) + ronda) % 2 === 0

export const esMiTurno = (j: Partida) => {
    if (j.modo === "local") return true
    const empiezoYo = empiezaAnfitrion(j.codigo, j.ronda) === (j.rol === "anfitrion")
    return (j.jugadas % 2 === 0) === empiezoYo
}

export type Fase = "sala" | "eligiendo" | "esperando-rival" | "jugando" | "fin"

export const faseDe = (j: Partida): Fase => {
    if (j.final) return "fin"
    if (j.modo === "online" && j.rivalNombre === null) return "sala"
    if (!j.listo) return "eligiendo"
    if (j.modo === "online" && !j.rivalListo) return "esperando-rival"
    return "jugando"
}

const rondaNueva = (j: Partida, ronda: number): Partida => ({
    ...j,
    ronda,
    secreto: null,
    listo: false,
    rivalListo: false,
    bajadas: [],
    jugadas: 0,
    pendiente: null,
    porResponder: null,
    ultimaRespondida: null,
    historial: [],
    rivalQuedan: null,
    final: null,
})

const partidaNueva = (modo: Modo, rol: Rol, codigo: string, nombre: string): Partida =>
    rondaNueva(
        {
            version: 1,
            modo,
            rol,
            codigo,
            nombre,
            rivalNombre: null,
            ronda: 1,
            secreto: null,
            listo: false,
            rivalListo: false,
            bajadas: [],
            jugadas: 0,
            pendiente: null,
            porResponder: null,
            ultimaRespondida: null,
            historial: [],
            rivalQuedan: null,
            final: null,
            marcador: { yo: 0, rival: 0 },
            actualizado: Date.now(),
        },
        1
    )

const leerGuardada = (): Partida | null => {
    try {
        const texto = localStorage.getItem(CLAVE)
        if (!texto) return null
        const j = JSON.parse(texto) as Partida
        if (j.version !== 1 || Date.now() - j.actualizado > VIGENCIA) return null
        return j
    } catch {
        return null
    }
}

const guardar = (j: Partida | null) => {
    try {
        if (j) localStorage.setItem(CLAVE, JSON.stringify(j))
        else localStorage.removeItem(CLAVE)
    } catch {
        // Sin almacenamiento la partida dura solo mientras la página siga abierta
    }
}

export type Motor = ReturnType<typeof crearMotor>

export function crearMotor() {
    let partida: Partida | null = null
    let guardada: Partida | null | undefined
    const oyentes = new Set<() => void>()
    let enviar: (m: Mensaje) => void = () => { }
    let avisar: (a: Aviso) => void = () => { }

    const cambiar = (nueva: Partida | null) => {
        partida = nueva ? { ...nueva, actualizado: Date.now() } : null
        guardada = partida
        guardar(partida)
        oyentes.forEach((f) => f())
    }

    // Cambia la partida actual si existe y sigue siendo la misma ronda
    const actualizar = (cambio: (j: Partida) => Partida) => {
        if (partida) cambiar(cambio(partida))
    }

    const hola = (j: Partida): Mensaje => ({
        t: "hola",
        nombre: j.nombre,
        ronda: j.ronda,
        listo: j.listo,
        quedan: quedanDe(j),
    })

    // Lo que quedó sin contestar se vuelve a mandar al reconectar.
    // El otro lado sabe reconocer lo repetido.
    const reenviarPendiente = (j: Partida) => {
        const p = j.pendiente
        if (!p || j.modo !== "online") return
        if (p.tipo === "pregunta") {
            enviar({ t: "pregunta", ronda: j.ronda, id: p.id, texto: p.texto, rasgo: p.rasgo })
        } else if (j.secreto) {
            enviar({ t: "adivinar", ronda: j.ronda, id: p.id, personaje: p.personaje, miSecreto: j.secreto })
        }
    }

    const terminar = (j: Partida, final: Final): Partida => ({
        ...j,
        pendiente: null,
        porResponder: null,
        final,
        marcador: final.gane
            ? { ...j.marcador, yo: j.marcador.yo + 1 }
            : { ...j.marcador, rival: j.marcador.rival + 1 },
    })

    const recibir = (m: Mensaje) => {
        let j = partida
        if (!j || j.modo !== "online" || m.t === "ping") return

        if (m.t === "hola") {
            const nombre = m.nombre.trim().slice(0, 20)
            const primeraVez = j.rivalNombre === null
            j = { ...j, rivalNombre: nombre }
            if (m.ronda > j.ronda) j = rondaNueva(j, m.ronda)
            if (m.ronda === j.ronda) j = { ...j, rivalListo: m.listo, rivalQuedan: m.quedan }
            cambiar(j)
            if (primeraVez) avisar({ tipo: "rival-conectado", nombre })
            reenviarPendiente(j)
            return
        }

        // Mensajes de una ronda vieja ya no cuentan; uno de una ronda nueva es que pidieron revancha
        if (m.ronda < j.ronda) return
        if (m.ronda > j.ronda) j = rondaNueva(j, m.ronda)

        switch (m.t) {
            case "ronda":
                cambiar(j)
                return

            case "listo":
                cambiar({ ...j, rivalListo: true })
                if (j.listo) avisar({ tipo: "rival-listo" })
                return

            case "quedan":
                cambiar({ ...j, rivalQuedan: m.n })
                return

            case "pregunta": {
                // Ya la contestamos y no le llegó: la misma respuesta otra vez
                if (j.ultimaRespondida?.id === m.id) {
                    enviar({ t: "respuesta", ronda: j.ronda, id: m.id, si: j.ultimaRespondida.si })
                    return
                }
                if (j.porResponder?.id === m.id || j.final) return
                const registro: Registro = { id: m.id, quien: "rival", texto: m.texto, rasgo: m.rasgo, respuesta: null }

                // Las de la lista se contestan solas con la ficha del personaje
                if (m.rasgo && j.secreto) {
                    const si = tiene(j.secreto, m.rasgo)
                    cambiar({
                        ...j,
                        jugadas: j.jugadas + 1,
                        ultimaRespondida: { id: m.id, si },
                        historial: [...j.historial, { ...registro, respuesta: si }],
                    })
                    enviar({ t: "respuesta", ronda: j.ronda, id: m.id, si })
                    avisar({ tipo: "te-preguntaron", texto: m.texto, si })
                    return
                }

                cambiar({
                    ...j,
                    porResponder: { id: m.id, texto: m.texto.slice(0, 140) },
                    historial: [...j.historial, registro],
                })
                avisar({ tipo: "pregunta-libre" })
                return
            }

            case "respuesta": {
                const p = j.pendiente
                if (p?.tipo !== "pregunta" || p.id !== m.id) return
                cambiar({
                    ...j,
                    pendiente: null,
                    jugadas: j.jugadas + 1,
                    historial: j.historial.map((r) => (r.id === m.id ? { ...r, respuesta: m.si } : r)),
                })
                avisar({ tipo: "respuesta", texto: p.texto, rasgo: p.rasgo, si: m.si })
                return
            }

            case "adivinar": {
                if (!j.secreto) return
                const acierto = m.personaje === j.secreto
                if (!j.final) {
                    j = terminar(j, {
                        gane: !acierto,
                        adivinoYo: false,
                        intento: m.personaje,
                        miSecreto: j.secreto,
                        suSecreto: m.miSecreto,
                    })
                    cambiar(j)
                    avisar({ tipo: "final", gane: !acierto })
                }
                enviar({ t: "resultado", ronda: j.ronda, id: m.id, acierto, suSecreto: j.secreto ?? "" })
                return
            }

            case "resultado": {
                const p = j.pendiente
                if (p?.tipo !== "adivinar" || p.id !== m.id || !j.secreto || j.final) return
                cambiar(
                    terminar(j, {
                        gane: m.acierto,
                        adivinoYo: true,
                        intento: p.personaje,
                        miSecreto: j.secreto,
                        suSecreto: m.suSecreto || null,
                    })
                )
                avisar({ tipo: "final", gane: m.acierto })
                return
            }
        }
    }

    return {
        leer: () => partida,
        suscribir: (f: () => void) => {
            oyentes.add(f)
            return () => {
                oyentes.delete(f)
            }
        },
        // La partida que quedó a medias en este cel (para ofrecer continuarla)
        guardada: () => {
            if (guardada === undefined) guardada = leerGuardada()
            return guardada
        },
        usarEnvio: (f: (m: Mensaje) => void) => {
            enviar = f
        },
        usarAvisos: (f: (a: Aviso) => void) => {
            avisar = f
            return () => {
                if (avisar === f) avisar = () => { }
            }
        },

        crear: (nombre: string) => cambiar(partidaNueva("online", "anfitrion", nuevoCodigo(), nombre)),
        unirse: (codigo: string, nombre: string) => cambiar(partidaNueva("online", "invitado", codigo, nombre)),
        jugarLocal: (codigo: string, nombre: string) => cambiar(partidaNueva("local", "anfitrion", codigo, nombre)),
        continuar: () => {
            const j = leerGuardada()
            if (j) cambiar(j)
        },
        salir: () => cambiar(null),
        olvidarGuardada: () => {
            guardada = null
            guardar(null)
            oyentes.forEach((f) => f())
        },

        // Se abrió la conexión con el otro celular
        alConectar: () => {
            if (partida?.modo === "online") enviar(hola(partida))
        },
        recibir,

        // Ya no hay conexión: siguen jugando cada quien en su cel, en voz alta
        seguirSinConexion: () => actualizar((j) => ({ ...j, modo: "local", pendiente: null, porResponder: null })),

        elegirSecreto: (id: string) => actualizar((j) => (j.listo ? j : { ...j, secreto: id })),
        confirmarSecreto: () => {
            const j = partida
            if (!j?.secreto || j.listo) return
            cambiar({ ...j, listo: true })
            enviar({ t: "listo", ronda: j.ronda })
        },

        alternar: (id: string) => {
            const j = partida
            if (!j || j.final) return
            const bajadas = j.bajadas.includes(id) ? j.bajadas.filter((x) => x !== id) : [...j.bajadas, id]
            const nueva = { ...j, bajadas }
            cambiar(nueva)
            enviar({ t: "quedan", ronda: j.ronda, n: quedanDe(nueva) })
        },
        bajar: (ids: string[]) => {
            const j = partida
            if (!j || j.final || ids.length === 0) return
            const nueva = { ...j, bajadas: [...new Set([...j.bajadas, ...ids])] }
            cambiar(nueva)
            enviar({ t: "quedan", ronda: j.ronda, n: quedanDe(nueva) })
        },

        preguntar: (texto: string, rasgo?: Rasgo) => {
            const j = partida
            const limpio = texto.trim().slice(0, 140)
            if (!j || j.modo !== "online" || !limpio || j.pendiente || !esMiTurno(j) || faseDe(j) !== "jugando") return
            const id = nuevoId()
            cambiar({
                ...j,
                pendiente: { tipo: "pregunta", id, texto: limpio, rasgo },
                historial: [...j.historial, { id, quien: "yo", texto: limpio, rasgo, respuesta: null }],
            })
            enviar({ t: "pregunta", ronda: j.ronda, id, texto: limpio, rasgo })
        },
        // Sin conexión: anotar lo que contestó el rival en voz alta
        anotar: (texto: string, rasgo: Rasgo, si: boolean) =>
            actualizar((j) => ({
                ...j,
                historial: [...j.historial, { id: nuevoId(), quien: "yo", texto, rasgo, respuesta: si }],
            })),
        responder: (si: boolean) => {
            const j = partida
            const p = j?.porResponder
            if (!j || !p) return
            cambiar({
                ...j,
                porResponder: null,
                jugadas: j.jugadas + 1,
                ultimaRespondida: { id: p.id, si },
                historial: j.historial.map((r) => (r.id === p.id ? { ...r, respuesta: si } : r)),
            })
            enviar({ t: "respuesta", ronda: j.ronda, id: p.id, si })
        },

        adivinar: (id: string) => {
            const j = partida
            if (!j?.secreto || j.modo !== "online" || j.pendiente || !esMiTurno(j) || faseDe(j) !== "jugando") return
            const pendiente: Pendiente = { tipo: "adivinar", id: nuevoId(), personaje: id }
            cambiar({ ...j, pendiente })
            enviar({ t: "adivinar", ronda: j.ronda, id: pendiente.id, personaje: id, miSecreto: j.secreto })
        },
        // Sin conexión, cada quien dice cómo acabó
        terminarLocal: (gane: boolean, adivinoYo: boolean, intento: string | null) =>
            actualizar((j) =>
                j.final || !j.secreto
                    ? j
                    : terminar(j, {
                        gane,
                        adivinoYo,
                        intento,
                        miSecreto: j.secreto,
                        suSecreto: adivinoYo && gane ? intento : null,
                    })
            ),

        revancha: () => {
            const j = partida
            if (!j) return
            const nueva = rondaNueva(j, j.ronda + 1)
            cambiar(nueva)
            enviar({ t: "ronda", ronda: nueva.ronda })
        },
    }
}

export const nombreDe = (id: string | null | undefined) => personaje(id)?.nombre ?? "?"
