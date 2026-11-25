// Efectos de sonido del Adivina Quién, hechos con Web Audio (sin archivos de audio).

const SILENCIO = 0.0001 // las rampas exponenciales no pueden llegar a 0

let contexto: AudioContext | null = null
let maestro: GainNode | null = null
let activo = true

const obtenerContexto = () => {
    if (typeof window === "undefined" || !activo) return null
    if (!contexto) {
        const AC =
            window.AudioContext ??
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (!AC) return null
        contexto = new AC()
        maestro = contexto.createGain()
        maestro.gain.value = 0.9
        maestro.connect(contexto.destination)
    }
    if (contexto.state === "suspended") contexto.resume().catch(() => { })
    return contexto
}

const nota = (
    frecuencia: number,
    inicio: number,
    duracion: number,
    { tipo = "triangle" as OscillatorType, volumen = 0.25, hasta }: { tipo?: OscillatorType; volumen?: number; hasta?: number } = {}
) => {
    const c = obtenerContexto()
    if (!c || !maestro) return
    const t = c.currentTime + inicio
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = tipo
    osc.frequency.setValueAtTime(frecuencia, t)
    if (hasta) osc.frequency.exponentialRampToValueAtTime(hasta, t + duracion)
    g.gain.setValueAtTime(SILENCIO, t)
    g.gain.exponentialRampToValueAtTime(volumen, t + 0.015)
    g.gain.exponentialRampToValueAtTime(SILENCIO, t + duracion)
    osc.connect(g).connect(maestro)
    osc.start(t)
    osc.stop(t + duracion + 0.05)
}

export const sonidos = {
    activar: (si: boolean) => {
        activo = si
    },
    // En iPhone el audio solo arranca después de un toque
    desbloquear: () => {
        obtenerContexto()
    },
    // La tarjeta que cae sobre el tablero
    voltear: (abajo: boolean) => {
        nota(abajo ? 320 : 220, 0, 0.09, { tipo: "square", volumen: 0.05, hasta: abajo ? 90 : 520 })
    },
    // Llegó una pregunta o una respuesta
    aviso: () => {
        nota(880, 0, 0.25, { tipo: "sine", volumen: 0.18 })
        nota(1320, 0.12, 0.35, { tipo: "sine", volumen: 0.14 })
    },
    si: () => {
        nota(523, 0, 0.18, { volumen: 0.2 })
        nota(784, 0.1, 0.3, { volumen: 0.2 })
    },
    no: () => {
        nota(311, 0, 0.2, { volumen: 0.2 })
        nota(233, 0.12, 0.35, { volumen: 0.2 })
    },
    // Fantasmita: una nota que tiembla como theremin
    fantasma: () => {
        const c = obtenerContexto()
        if (!c || !maestro) return
        const t = c.currentTime
        const osc = c.createOscillator()
        const vibrato = c.createOscillator()
        const profundidad = c.createGain()
        const g = c.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(440, t)
        osc.frequency.exponentialRampToValueAtTime(660, t + 0.5)
        osc.frequency.exponentialRampToValueAtTime(330, t + 1.1)
        vibrato.frequency.value = 6
        profundidad.gain.value = 14
        vibrato.connect(profundidad).connect(osc.frequency)
        g.gain.setValueAtTime(SILENCIO, t)
        g.gain.exponentialRampToValueAtTime(0.16, t + 0.2)
        g.gain.exponentialRampToValueAtTime(SILENCIO, t + 1.2)
        osc.connect(g).connect(maestro)
        osc.start(t)
        vibrato.start(t)
        osc.stop(t + 1.25)
        vibrato.stop(t + 1.25)
    },
    ganar: () => {
        ;[392, 494, 587, 784].forEach((f, i) => nota(f, i * 0.11, 0.4, { volumen: 0.2 }))
        nota(988, 0.5, 0.7, { tipo: "sine", volumen: 0.16 })
    },
    perder: () => {
        nota(392, 0, 0.35, { tipo: "sawtooth", volumen: 0.07, hasta: 370 })
        nota(370, 0.35, 0.35, { tipo: "sawtooth", volumen: 0.07, hasta: 349 })
        nota(349, 0.7, 0.9, { tipo: "sawtooth", volumen: 0.07, hasta: 262 })
    },
}
