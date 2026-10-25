// Baja, recorta y guarda en el sitio las fotos de los personajes del Adivina Quién.
// Sin esto la página igual muestra las fotos (las busca en Wikipedia o Fandom al
// abrirse); con esto quedan fijas, más rápidas y ya revisadas.
//
//   node scripts/fotos-adivina-quien.mjs            → todas las que faltan
//   node scripts/fotos-adivina-quien.mjs freddy zim → solo esas (aunque ya existan)
//
// De dónde sale cada foto: src/app/adivina-quien/fuentes-fotos.json
// Las fotos quedan en public/adivina-quien/fotos/<id>.webp y la lista en
// src/app/adivina-quien/fotos.json.

import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import { AGENTE, buscarFoto } from "../src/app/adivina-quien/buscar-foto.mjs"

const RAIZ = path.resolve(import.meta.dirname, "..")
const CARPETA = path.join(RAIZ, "public/adivina-quien/fotos")
const LISTA = path.join(RAIZ, "src/app/adivina-quien/fotos.json")
const FUENTES = JSON.parse(await fs.readFile(path.join(RAIZ, "src/app/adivina-quien/fuentes-fotos.json"), "utf8"))
const ANCHO = 360
const ALTO = 480

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

const pedidos = process.argv.slice(2)
const lista = JSON.parse(await fs.readFile(LISTA, "utf8").catch(() => "{}"))
await fs.mkdir(CARPETA, { recursive: true })

const ids = pedidos.length ? pedidos : Object.keys(FUENTES).filter((id) => !lista[id])
const fallidos = []
for (const id of ids) {
    const fuentes = FUENTES[id]
    if (!fuentes) {
        console.log(`? ${id}: no tiene fuentes`)
        continue
    }
    let hecho = false
    for (const fuente of fuentes) {
        try {
            const foto = await buscarFoto(fuente, 960)
            if (!foto) continue
            const r = await fetch(foto.url, { headers: { "User-Agent": AGENTE } })
            if (!r.ok) throw new Error(`${r.status} al bajar la foto`)
            const salida = await sharp(Buffer.from(await r.arrayBuffer()), { animated: false })
                .rotate()
                .resize(ANCHO, ALTO, { fit: "cover", position: sharp.strategy.attention })
                .webp({ quality: 72 })
                .toBuffer()
            await fs.writeFile(path.join(CARPETA, `${id}.webp`), salida)
            lista[id] = { pagina: foto.pagina, archivo: foto.archivo, enlace: foto.enlace }
            console.log(`✓ ${id}: ${foto.pagina} → ${foto.archivo} (${Math.round(salida.length / 1024)} KB)`)
            hecho = true
            break
        } catch (e) {
            console.log(`  ${id}: falló ${fuente} (${e.message})`)
        }
        await esperar(150)
    }
    if (!hecho) fallidos.push(id)
    await esperar(150)
}

const ordenada = Object.fromEntries(Object.entries(lista).sort(([a], [b]) => a.localeCompare(b)))
await fs.writeFile(LISTA, JSON.stringify(ordenada, null, 4) + "\n")
console.log(`\n${Object.keys(ordenada).length} con foto.${fallidos.length ? ` Sin foto: ${fallidos.join(", ")}` : ""}`)
