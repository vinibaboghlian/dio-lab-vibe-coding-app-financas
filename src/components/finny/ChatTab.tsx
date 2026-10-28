import { useEffect, useRef, useState } from "react";
import { ArrowUp, Pencil, Trash2, Check } from "lucide-react";
import { CATEGORIES, brl, type CategoryId, type useFinance } from "@/lib/finance";
import { CategoryBadge, CategoryIcon } from "./CategoryIcon";

type F = ReturnType<typeof useFinance>;

function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p.startsWith("*") ? <em key={i}>{p.slice(1, -1)}</em> : <span key={i}>{p}</span>,
      )}
    </>
  );
}

function TxCard({ f, id }: { f: F; id: string }) {
  const tx = f.transactions.find((t) => t.id === id);
  const [editing, setEditing] = useState(false);
  if (!tx) return <div className="mt-2 rounded-2xl border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">Lançamento removido</div>;
  return (
    <div className="mt-2 rounded-2xl border border-border bg-card p-3 shadow-soft animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-3">
        <CategoryIcon id={tx.category} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-card-foreground">{tx.description}</p>
          <CategoryBadge id={tx.category} />
        </div>
        <p className={`font-display text-base font-bold ${tx.type === "receita" ? "text-income" : "text-expense"}`}>
          {tx.type === "receita" ? "+" : "−"}{brl(tx.amount)}
        </p>
      </div>
      {editing ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(Object.keys(CATEGORIES) as CategoryId[]).map((c) => (
            <button key={c} onClick={() => { f.updateTx(tx.id, { category: c }); setEditing(false); }} className={`rounded-full ${c === tx.category ? "ring-2 ring-ring" : ""}`}>
              <CategoryBadge id={c} />
            </button>
          ))}
          <button onClick={() => f.updateTx(tx.id, { type: tx.type === "receita" ? "despesa" : "receita" })} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            Virar {tx.type === "receita" ? "despesa" : "receita"}
          </button>
          <button onClick={() => setEditing(false)} className="ml-auto text-primary"><Check className="h-4 w-4" /></button>
        </div>
      ) : (
        <div className="mt-2 flex justify-end gap-3 text-xs text-muted-foreground">
          <button onClick={() => setEditing(true)} className="flex items-center gap-1 hover:text-foreground"><Pencil className="h-3 w-3" /> Editar</button>
          <button onClick={() => f.deleteTx(tx.id)} className="flex items-center gap-1 hover:text-expense"><Trash2 className="h-3 w-3" /> Excluir</button>
        </div>
      )}
    </div>
  );
}

const CHIPS = [
  { label: "💡 Dica de economia", kind: "dica" as const },
  { label: "🎯 Como está minha meta?", kind: "meta" as const },
  { label: "📊 Resumo da semana", kind: "resumo" as const },
];

export function ChatTab({ f }: { f: F }) {
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [f.chat.length]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    f.send(text.trim());
    setText("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {f.chat.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[85%]">
              <div className={`rounded-3xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-secondary text-secondary-foreground"}`}>
                <Rich text={m.text} />
              </div>
              {m.txId && <TxCard f={f} id={m.txId} />}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex flex-wrap gap-2 px-4 pb-2">
        {CHIPS.map((c) => (
          <button
            key={c.kind}
            onClick={() => f.insight(c.kind)}
            className="max-w-full rounded-full border border-border bg-card px-3 py-1.5 text-left text-xs font-medium text-card-foreground transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="block truncate">{c.label}</span>
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-border bg-background px-4 py-3">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Ex: "gastei 30 no lanche"'
          className="h-12 flex-1 rounded-full border border-input bg-card px-5 text-sm text-foreground outline-none focus:border-primary"
        />
        <button type="submit" aria-label="Enviar" className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground transition active:scale-95 disabled:opacity-50" disabled={!text.trim()}>
          <ArrowUp className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
