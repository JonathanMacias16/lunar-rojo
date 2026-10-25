// /adivina-quien/foto/<id>: manda a la foto del personaje en Wikipedia o Fandom.
// La respuesta se guarda en la caché de Vercel, así que cada foto se busca pocas veces.
import { buscarFoto } from "../../buscar-foto.mjs"
import fuentes from "../../fuentes-fotos.json"

const listaFuentes: Record<string, string[]> = fuentes

const ENCONTRADA = "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=2592000"
const NO_ENCONTRADA = "public, max-age=600, s-maxage=3600"

export async function GET(_pedido: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const opciones = listaFuentes[id]
    if (!opciones) return new Response("No existe ese personaje", { status: 404 })

    const intentos: string[] = []
    for (const fuente of opciones) {
        try {
            const foto = await buscarFoto(fuente, 500)
            return new Response(null, {
                status: 302,
                headers: { Location: foto.url, "Cache-Control": ENCONTRADA },
            })
        } catch (e) {
            intentos.push(`${fuente}: ${e instanceof Error ? e.message : e}`)
        }
    }
    // Sin foto: la tarjeta se queda con su emoji. Se cuenta qué pasó para poder corregir la fuente.
    console.warn(`Sin foto para ${id}`, intentos)
    return new Response(`Sin foto\n${intentos.join("\n")}`, {
        status: 404,
        headers: { "Cache-Control": NO_ENCONTRADA, "Content-Type": "text/plain; charset=utf-8" },
    })
}
