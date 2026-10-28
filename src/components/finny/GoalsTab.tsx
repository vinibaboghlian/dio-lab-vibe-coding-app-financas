import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { brl, type useFinance } from "@/lib/finance";

type F = ReturnType<typeof useFinance>;

export function GoalsTab({ f }: { f: F }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [emoji, setEmoji] = useState("🎯");

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    const t = parseFloat(target.replace(/\./g, "").replace(",", "."));
    if (!name.trim() || !t) return;
    f.addGoal({ name: name.trim(), target: t, saved: 0, emoji });
    setName(""); setTarget(""); setOpen(false);
  };

  return (
    <div className="space-y-4 overflow-y-auto px-4 py-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Minhas metas</h1>
          <p className="text-sm text-muted-foreground">Cada real guardado conta. 🌱</p>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Nova
        </button>
      </div>

      {open && (
        <form onSubmit={create} className="space-y-3 rounded-3xl border border-border bg-card p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex gap-2">
            <select value={emoji} onChange={(e) => setEmoji(e.target.value)} className="h-11 rounded-2xl border border-input bg-background px-2 text-lg">
              {["🎯", "🏠", "🚗", "💻", "🎓", "💍", "🐶", "✈️"].map((e) => <option key={e}>{e}</option>)}
            </select>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da meta" className="h-11 flex-1 rounded-2xl border border-input bg-background px-4 text-sm outline-none focus:border-primary" />
          </div>
          <input value={target} onChange={(e) => setTarget(e.target.value)} inputMode="decimal" placeholder="Valor alvo (R$)" className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none focus:border-primary" />
          <button className="h-11 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">Criar meta</button>
        </form>
      )}

      {f.goals.map((g) => {
        const pct = Math.round((g.saved / g.target) * 100);
        return (
          <article key={g.id} className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-2xl">{g.emoji}</span>
              <div className="flex-1">
                <h3 className="font-display text-base font-semibold text-card-foreground">{g.name}</h3>
                <p className="text-sm text-muted-foreground">{brl(g.saved)} de {brl(g.target)}</p>
              </div>
              <span className="font-display text-xl font-bold text-primary">{pct}%</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-progress transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-4 flex items-center gap-2">
              {[50, 100, 250].map((v) => (
                <button key={v} onClick={() => f.depositGoal(g.id, v)} disabled={pct >= 100} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground disabled:opacity-40">
                  +{brl(v).replace(",00", "")}
                </button>
              ))}
              <button onClick={() => f.deleteGoal(g.id)} aria-label="Excluir meta" className="ml-auto text-muted-foreground hover:text-expense"><Trash2 className="h-4 w-4" /></button>
            </div>
            {pct >= 100 && <p className="mt-3 text-sm font-medium text-income">🎉 Meta batida! Orgulho define.</p>}
          </article>
        );
      })}
    </div>
  );
}
