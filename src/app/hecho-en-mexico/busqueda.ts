import type { Categoria, IdCategoria, Marca, Nivel } from "./datos"

// Minúsculas, sin acentos ni signos: "Papel de Baño" → "papel de bano"
export const normalizar = (texto: string) =>
    texto
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim()

// Al escribir a medias ("refr") buscamos desde esta cantidad de letras
const MINIMO_PARCIAL = 3

type Tramo = { inicio: number; fin: number }

// Qué tan segura es una coincidencia:
// 2 = escribieron el término completo ("quiero un refresco" trae "refresco")
// 1 = escribieron palabras completas del principio del término ("jabon" → "jabon para ropa")
// 0 = escribieron el principio de una palabra ("refr" → "refresco", pero también "pan" → "panales")
type Fuerza = 0 | 1 | 2

type Coincidencia = { clave: string; tramo: Tramo; fuerza: Fuerza }

const escapar = (texto: string) => texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// Dónde aparece el término completo dentro de lo que escribieron (acepta plural)
const tramoEnConsulta = (consulta: string, termino: string): Tramo | null => {
    if (!termino) return null
    const encontrado = new RegExp(`(^| )${escapar(termino)}(es|s)?(?= |$)`).exec(consulta)
    if (!encontrado) return null
    return { inicio: encontrado.index + encontrado[1].length, fin: encontrado.index + encontrado[0].length }
}

// Lo que escribieron es el principio del término, o de una de sus palabras si `enCualquierPalabra`
const fuerzaParcial = (consulta: string, termino: string, enCualquierPalabra: boolean): Fuerza | null => {
    if (consulta.length < MINIMO_PARCIAL) return null
    const conEspacio = ` ${termino} `
    if (enCualquierPalabra ? conEspacio.includes(` ${consulta} `) : conEspacio.startsWith(` ${consulta} `)) return 1
    if (enCualquierPalabra ? conEspacio.includes(` ${consulta}`) : conEspacio.startsWith(` ${consulta}`)) return 0
    return null
}

const mejorCoincidencia = (
    clave: string,
    consulta: string,
    terminos: string[],
    enCualquierPalabra: boolean
): Coincidencia | null => {
    let mejor: Coincidencia | null = null
    for (const termino of terminos) {
        const tramo = tramoEnConsulta(consulta, termino)
        const fuerza = tramo ? 2 : fuerzaParcial(consulta, termino, enCualquierPalabra)
        if (fuerza === null) continue
        const candidata: Coincidencia = { clave, tramo: tramo ?? { inicio: 0, fin: consulta.length }, fuerza }
        const largo = (c: Coincidencia) => c.tramo.fin - c.tramo.inicio
        if (!mejor || largo(candidata) > largo(mejor) || (largo(candidata) === largo(mejor) && fuerza > mejor.fuerza)) {
            mejor = candidata
        }
    }
    return mejor
}

// Si "pasta de dientes" ya explica esas palabras, no mostramos también "pasta"
const quitarContenidas = (coincidencias: Coincidencia[]) =>
    coincidencias.filter(
        (c) =>
            !coincidencias.some(
                (otra) =>
                    otra.clave !== c.clave &&
                    otra.tramo.inicio <= c.tramo.inicio &&
                    otra.tramo.fin >= c.tramo.fin &&
                    otra.tramo.fin - otra.tramo.inicio > c.tramo.fin - c.tramo.inicio
            )
    )

// "PepsiCo (Sabritas)" → "PepsiCo"
export const duenoBase = (dueno: string) => dueno.replace(/\s*\(.*\)\s*$/, "")

// Palabras del inicio que no identifican a la empresa: "Fábrica de Jabón La Corona" → "corona"
const GENERICAS = new Set(["grupo", "the", "fabrica", "de", "jabon", "empresas", "industrias", "la", "el"])
const sinGenericas = (texto: string) => {
    const palabras = texto.split(" ")
    while (palabras.length > 1 && GENERICAS.has(palabras[0])) palabras.shift()
    return palabras.join(" ")
}

const coincideDueno = (consulta: string, dueno: string) => {
    const completo = normalizar(duenoBase(dueno))
    const nucleo = sinGenericas(completo)
    return (
        tramoEnConsulta(consulta, completo) !== null ||
        tramoEnConsulta(consulta, nucleo) !== null ||
        (consulta.length >= MINIMO_PARCIAL && nucleo.startsWith(consulta))
    )
}

const ORDEN_NIVEL: Record<Nivel, number> = { mexicana: 0, "hecha-en-mexico": 1, extranjera: 2 }

export const ordenarPorNivel = (marcas: Marca[]) =>
    [...marcas].sort((a, b) => ORDEN_NIVEL[a.nivel] - ORDEN_NIVEL[b.nivel])

export const marcasDeCategoria = (id: IdCategoria, marcas: Marca[]) =>
    ordenarPorNivel(marcas.filter((m) => m.categorias.includes(id)))

export type Resultado = {
    marcas: Marca[]
    duenos: { dueno: string; marcas: Marca[] }[]
    categorias: Categoria[]
}

export function buscar(texto: string, categorias: Categoria[], marcas: Marca[]): Resultado {
    const consulta = normalizar(texto)
    if (!consulta) return { marcas: [], duenos: [], categorias: [] }

    const todas: Coincidencia[] = []
    for (const categoria of categorias) {
        const terminos = [categoria.nombre, ...categoria.terminos].map(normalizar)
        const c = mejorCoincidencia(`c:${categoria.id}`, consulta, terminos, true)
        if (c) todas.push(c)
    }
    marcas.forEach((marca, i) => {
        // Con marcas solo vale el principio del nombre: "leche" no debe traer "Nutri Leche"
        const terminos = [marca.nombre, ...(marca.alias ?? [])].map(normalizar)
        const c = mejorCoincidencia(`m:${i}`, consulta, terminos, false)
        if (c) todas.push(c)
    })

    let finales = quitarContenidas(todas)
    // Con algo seguro, sobran las coincidencias débiles: "pan" no debe traer "pañales"
    if (finales.some((c) => c.fuerza > 0)) finales = finales.filter((c) => c.fuerza > 0)

    const categoriasEncontradas = categorias.filter((cat) => finales.some((c) => c.clave === `c:${cat.id}`))
    const enCategoriaEncontrada = (m: Marca) => m.categorias.some((id) => categoriasEncontradas.some((cat) => cat.id === id))

    // Una marca escrita a medias que ya sale en su categoría no se repite arriba ("chocolate" → Chocolate Ibarra)
    const marcasEncontradas = marcas.filter((m, i) => {
        const c = finales.find((x) => x.clave === `m:${i}`)
        return c !== undefined && (c.fuerza === 2 || !enCategoriaEncontrada(m))
    })

    // También por empresa: "bimbo", "pepsico", "corona"… sin repetir lo que ya se muestra
    const porDueno = new Map<string, Marca[]>()
    for (const marca of marcas) {
        if (marcasEncontradas.includes(marca) || enCategoriaEncontrada(marca)) continue
        if (!coincideDueno(consulta, marca.dueno)) continue
        const base = duenoBase(marca.dueno)
        porDueno.set(base, [...(porDueno.get(base) ?? []), marca])
    }
    const duenos = [...porDueno.entries()].map(([dueno, lista]) => ({ dueno, marcas: ordenarPorNivel(lista) }))

    return { marcas: marcasEncontradas, duenos, categorias: categoriasEncontradas }
}

// Para una marca que no es mexicana: las mexicanas de su misma categoría
export const alternativasMexicanas = (marca: Marca, marcas: Marca[]) =>
    marca.nivel === "mexicana"
        ? []
        : marcas.filter((m) => m.nivel === "mexicana" && m !== marca && m.categorias.some((c) => marca.categorias.includes(c)))
