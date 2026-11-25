"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

// Copia el prompt plantilla completo al portapapeles.
export function CopyButton({ text, label }: { text: string; label: string }) {
    const [copied, setCopied] = useState(false)
    return (
        <button
            type="button"
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(text)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                } catch {
                    setCopied(false)
                }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-400"
        >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado" : label}
        </button>
    )
}
