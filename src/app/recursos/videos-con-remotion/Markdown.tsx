import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

// Estilos del Markdown con la línea visual del sitio (fondo oscuro, Geist).
const components: Components = {
    h1: ({ children }) => <h2 className="mt-2 mb-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{children}</h2>,
    h2: ({ children }) => <h2 className="mt-14 mb-4 text-2xl font-semibold tracking-tight text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-10 mb-3 text-lg font-semibold text-white">{children}</h3>,
    p: ({ children }) => <p className="my-4 leading-relaxed text-white/75">{children}</p>,
    a: ({ href, children }) => (
        <a href={href} className="text-red-400 underline decoration-red-400/40 underline-offset-4 hover:decoration-red-400">
            {children}
        </a>
    ),
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    ul: ({ children, className }) => (
        <ul className={className?.includes("contains-task-list") ? "my-4 space-y-2" : "my-4 list-disc space-y-2 pl-6 text-white/75 marker:text-white/30"}>
            {children}
        </ul>
    ),
    ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-6 text-white/75 marker:text-white/40">{children}</ol>,
    li: ({ children, className }) =>
        className?.includes("task-list-item") ? (
            <li className="flex list-none items-start gap-3 text-white/75 [&_input]:mt-1.5 [&_input]:accent-red-500">{children}</li>
        ) : (
            <li className="leading-relaxed">{children}</li>
        ),
    blockquote: ({ children }) => (
        <blockquote className="my-6 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-1 [&_p]:text-white/70">{children}</blockquote>
    ),
    hr: () => <hr className="my-10 border-white/10" />,
    table: ({ children }) => (
        <div className="my-6 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">{children}</table>
        </div>
    ),
    thead: ({ children }) => <thead className="bg-white/[0.04] text-white">{children}</thead>,
    th: ({ children }) => <th className="border-b border-white/10 px-4 py-3 font-medium">{children}</th>,
    td: ({ children }) => <td className="border-b border-white/5 px-4 py-3 align-top text-white/70">{children}</td>,
    pre: ({ children }) => (
        <pre className="my-6 overflow-x-auto rounded-xl border border-white/10 bg-black/60 p-5 text-[13px] leading-relaxed text-white/85">
            {children}
        </pre>
    ),
    code: ({ children, className }) =>
        className ? (
            <code className={`${className} font-mono`}>{children}</code>
        ) : (
            <code className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-white/90">{children}</code>
        ),
}

export function Markdown({ source }: { source: string }) {
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {source}
        </ReactMarkdown>
    )
}
