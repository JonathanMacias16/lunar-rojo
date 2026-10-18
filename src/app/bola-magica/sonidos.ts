// Efectos de sonido de la bola, hechos con Web Audio (sin archivos de audio).
import type { TipoRespuesta } from "./respuestas"

const SILENCIO = 0.0001 // las rampas exponenciales no pueden llegar a 0
const VOLUMEN = 1.7 // volumen general de todos los efectos

let contexto: AudioContext | null = null
let maestro: GainNode | null = null
let ruido: AudioBuffer | null = null

const obtenerContexto = () => {
    if (typeof window === "undefined") return null
    if (!contexto) {
        const AC =
            window.AudioContext ??
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (!AC) return null
        contexto = new AC()
        maestro = contexto.createGain()
        maestro.gain.value = VOLUMEN
        maestro.connect(contexto.destination)
    }
    if (contexto.state === "suspended") contexto.resume().catch(() => { })
    return contexto
}

const bufferRuido = (c: BaseAudioContext) => {
    if (!ruido || ruido.sampleRate !== c.sampleRate) {
        ruido = c.createBuffer(1, c.sampleRate * 2, c.sampleRate)
        const datos = ruido.getChannelData(0)
        for (let i = 0; i < datos.length; i++) datos[i] = Math.random() * 2 - 1
    }
    return ruido
}

// Burbuja que sube dentro del líquido
const burbuja = (c: BaseAudioContext, destino: AudioNode, t: number, volumen: number) => {
    const osc = c.createOscillator()
    const g = c.createGain()
    const f = 250 + Math.random() * 350
    osc.type = "sine"
    osc.frequency.setValueAtTime(f, t)
    osc.frequency.exponentialRampToValueAtTime(f * (2 + Math.random()), t + 0.07)
    g.gain.setValueAtTime(SILENCIO, t)
    g.gain.exponentialRampToValueAtTime(volumen, t + 0.01)
    g.gain.exponentialRampToValueAtTime(SILENCIO, t + 0.09)
    osc.connect(g).connect(destino)
    osc.start(t)
    osc.stop(t + 0.1)
}

// El dado chocando contra el plástico
const golpe = (c: BaseAudioContext, destino: AudioNode, t: number, volumen: number) => {
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = "triangle"
    osc.frequency.setValueAtTime(220, t)
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.08)
    g.gain.setValueAtTime(SILENCIO, t)
    g.gain.exponentialRampToValueAtTime(volumen, t + 0.005)
    g.gain.exponentialRampToValueAtTime(SILENCIO, t + 0.12)
    osc.connect(g).connect(destino)
    osc.start(t)
    osc.stop(t + 0.13)
}

// Líquido moviéndose de un lado a otro, con burbujas y golpecitos del dado
export const agitar = (c: BaseAudioContext, destino: AudioNode, t: number, duracion: number) => {
    const fuente = c.createBufferSource()
    fuente.buffer = bufferRuido(c)
    const filtro = c.createBiquadFilter()
    filtro.type = "bandpass"
    filtro.Q.value = 3
    const volumen = c.createGain()
    volumen.gain.value = SILENCIO
    fuente.connect(filtro).connect(volumen).connect(destino)

    const vaivenes = 7
    const tramo = duracion / vaivenes
    for (let i = 0; i < vaivenes; i++) {
        const ti = t + i * tramo
        const fuerza = 1 - (i / vaivenes) * 0.6
        filtro.frequency.setValueAtTime(350 + Math.random() * 150, ti)
        filtro.frequency.exponentialRampToValueAtTime(900 + Math.random() * 500, ti + tramo * 0.6)
        volumen.gain.setValueAtTime(SILENCIO, ti)
        volumen.gain.exponentialRampToValueAtTime(0.6 * fuerza, ti + tramo * 0.25)
        volumen.gain.exponentialRampToValueAtTime(SILENCIO, ti + tramo * 0.98)
        if (i % 2 === 0) golpe(c, destino, ti + tramo * 0.2, 0.2 * fuerza)
    }
    for (let i = 0; i < 8; i++) {
        burbuja(c, destino, t + Math.random() * duracion, 0.05 + Math.random() * 0.06)
    }
    fuente.start(t)
    fuente.stop(t + duracion + 0.1)
}

// "Fuush" cuando la bola se voltea
export const voltear = (c: BaseAudioContext, destino: AudioNode, t: number) => {
    const fuente = c.createBufferSource()
    fuente.buffer = bufferRuido(c)
    const filtro = c.createBiquadFilter()
    filtro.type = "bandpass"
    filtro.Q.value = 1.2
    filtro.frequency.setValueAtTime(300, t)
    filtro.frequency.exponentialRampToValueAtTime(1800, t + 0.45)
    const g = c.createGain()
    g.gain.setValueAtTime(SILENCIO, t)
    g.gain.exponentialRampToValueAtTime(0.2, t + 0.2)
    g.gain.exponentialRampToValueAtTime(SILENCIO, t + 0.5)
    fuente.connect(filtro).connect(g).connect(destino)
    fuente.start(t)
    fuente.stop(t + 0.55)
}

// Acorde que suena cuando aparece la respuesta: mayor si es sí, menor si es no
const ACORDES: Record<TipoRespuesta, number[]> = {
    si: [523.25, 659.25, 783.99, 1046.5], // Do mayor
    quizas: [523.25, 587.33, 783.99, 1174.66], // Do sus2
    no: [523.25, 622.25, 783.99, 1046.5], // Do menor
}

// Devuelve los nodos del eco para poder desconectarlos al terminar
export const revelar = (c: BaseAudioContext, destino: AudioNode, t: number, tipo: TipoRespuesta) => {
    const salida = c.createGain()
    salida.gain.value = 0.5
    salida.connect(destino)

    // Eco suave para que suene "mágico"
    const eco = c.createDelay()
    eco.delayTime.value = 0.22
    const tono = c.createBiquadFilter()
    tono.type = "lowpass"
    tono.frequency.value = 2500
    const retro = c.createGain()
    retro.gain.value = 0.35
    salida.connect(eco)
    eco.connect(tono)
    tono.connect(retro)
    retro.connect(eco)
    tono.connect(destino)

    burbuja(c, salida, t - 0.12, 0.15)

    ACORDES[tipo].forEach((f, i) => {
        const ti = t + i * 0.09
        for (const [multiplo, volumen, caida] of [[1, 0.16, 2.2], [2, 0.035, 1.2]]) {
            const osc = c.createOscillator()
            const g = c.createGain()
            osc.type = "sine"
            osc.frequency.value = f * multiplo
            g.gain.setValueAtTime(SILENCIO, ti)
            g.gain.exponentialRampToValueAtTime(volumen, ti + 0.04)
            g.gain.exponentialRampToValueAtTime(SILENCIO, ti + caida)
            osc.connect(g).connect(salida)
            osc.start(ti)
            osc.stop(ti + caida + 0.05)
        }
    })

    return [salida, eco, tono, retro]
}

// Lo que usa la página. Llamar `desbloquear` en un toque: los navegadores
// solo dejan sonar audio después de que el usuario interactúa.
export const sonidos = {
    desbloquear: () => {
        obtenerContexto()
    },
    // Mientras se dicta: en iPhone el micrófono se puede trabar si este audio está activo
    pausar: () => {
        if (contexto?.state === "running") contexto.suspend().catch(() => { })
    },
    agitar: (duracion: number) => {
        const c = obtenerContexto()
        if (c && maestro) agitar(c, maestro, c.currentTime + 0.02, duracion)
    },
    voltear: () => {
        const c = obtenerContexto()
        if (c && maestro) voltear(c, maestro, c.currentTime + 0.15)
    },
    revelar: (tipo: TipoRespuesta) => {
        const c = obtenerContexto()
        if (!c || !maestro) return
        const nodos = revelar(c, maestro, c.currentTime + 0.35, tipo)
        setTimeout(() => nodos.forEach((n) => n.disconnect()), 4500)
    },
}
