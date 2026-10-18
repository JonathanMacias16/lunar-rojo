export type TipoRespuesta = "si" | "quizas" | "no"

export type RespuestaBola = {
    tipo: TipoRespuesta // cambia el sonido con el que aparece
    lineas: string[]
}

// Las 20 respuestas clásicas de la bola mágica:
// 10 dicen que sí, 5 no se comprometen y 5 dicen que no.
// Cada respuesta va partida en renglones para que quepa en el triángulo,
// que es angosto arriba y ancho abajo (el renglón de arriba debe ser corto).
export const respuestas: RespuestaBola[] = [
    { tipo: "si", lineas: ["ES", "CIERTO"] },
    { tipo: "si", lineas: ["ASÍ", "SERÁ"] },
    { tipo: "si", lineas: ["SIN", "DUDA"] },
    { tipo: "si", lineas: ["SÍ,", "DEFINITIVAMENTE"] },
    { tipo: "si", lineas: ["PUEDES", "CONTAR", "CON ELLO"] },
    { tipo: "si", lineas: ["SEGÚN", "LO VEO,", "SÍ"] },
    { tipo: "si", lineas: ["LO MÁS", "PROBABLE"] },
    { tipo: "si", lineas: ["EL", "PANORAMA", "PINTA BIEN"] },
    { tipo: "si", lineas: ["SÍ"] },
    { tipo: "si", lineas: ["TODO", "APUNTA", "A QUE SÍ"] },

    { tipo: "quizas", lineas: ["ESTÁ", "BORROSO,", "INTENTA DE NUEVO"] },
    { tipo: "quizas", lineas: ["PREGUNTA", "DE NUEVO", "MÁS TARDE"] },
    { tipo: "quizas", lineas: ["MEJOR NO", "DECIRTE", "AHORA"] },
    { tipo: "quizas", lineas: ["NO PUEDO", "PREDECIRLO", "AHORA"] },
    { tipo: "quizas", lineas: ["ENFÓCATE", "Y PREGUNTA", "OTRA VEZ"] },

    { tipo: "no", lineas: ["NO", "CUENTES", "CON ELLO"] },
    { tipo: "no", lineas: ["MI", "RESPUESTA", "ES NO"] },
    { tipo: "no", lineas: ["MIS", "FUENTES", "DICEN QUE NO"] },
    { tipo: "no", lineas: ["EL", "PANORAMA", "NO PINTA BIEN"] },
    { tipo: "no", lineas: ["MUY", "DUDOSO"] },
]
