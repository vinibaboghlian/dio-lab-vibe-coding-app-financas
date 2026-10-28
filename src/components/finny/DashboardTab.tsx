import { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { CATEGORIES, brl, expensesByCategory, type useFinance } from "@/lib/finance";
import { CategoryIcon } from "./CategoryIcon";

type F = ReturnType<typeof useFinance>;

export function DashboardTab({ f }: { f: F }) {
  const [filter, setFilter] = useState<"todos" | "receita" | "despesa">("todos");
  const data = expensesByCategory(f.transactions);
  const list = [...f.transactions].filter((t) => filter === "todos" || t.type === filter).sort((a, b) => b.date.localeCompare(a.date));
  const month = new Date().toLocaleDateString("pt-BR", { month: "long" });

  return (
    <div className="space-y-5 overflow-y-auto px-4 py-5">
      <div className="rounded-3xl bg-hero p-5 text-hero-foreground shadow-glow">
        <p className="text-sm opacity-80">Saldo atual · {month}</p>
        <p className="font-display text-4xl font-bold tracking-tight">{brl(f.balance)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-hero-foreground/10 p-3">
            <p className="flex items-center gap-1 text-xs opacity-80"><ArrowDownLeft className="h-3.5 w-3.5" /> Entradas</p>
            <p className="font-display text-lg font-semibold">{brl(f.income)}</p>
          </div>
          <div className="rounded-2xl bg-hero-foreground/10 p-3">
            <p className="flex items-center gap-1 text-xs opacity-80"><ArrowUpRight className="h-3.5 w-3.5" /> Saídas</p>
            <p className="font-display text-lg font-semibold">{brl(f.expense)}</p>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-semibold text-card-foreground">Pra onde foi o dinheiro</h2>
        {data.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">Sem gastos ainda.</p> : (
          <div className="mt-2 flex items-center gap-4">
            <div className="h-36 w-36 shrink-0">
              <PieChart width={144} height={144}>
                  <Pie data={data} cx={72} cy={72} isAnimationActive={false} startAngle={90} endAngle={-270} dataKey="value" innerRadius={42} outerRadius={66} paddingAngle={3} stroke="none">
                    {data.map((d) => <Cell key={d.id} fill={CATEGORIES[d.id].color} />)}
                  </Pie>
                </PieChart>
            </div>
            <ul className="flex-1 space-y-1.5 text-sm">
              {data.slice(0, 6).map((d) => (
                <li key={d.id} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORIES[d.id].color }} />
                  <span className="flex-1 text-muted-foreground">{CATEGORIES[d.id].label}</span>
                  <span className="font-medium text-card-foreground">{Math.round((d.value / f.expense) * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Extrato</h2>
          <div className="flex rounded-full bg-muted p-1 text-xs">
            {(["todos", "receita", "despesa"] as const).map((k) => (
              <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-3 py-1 font-medium capitalize transition ${filter === k ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"}`}>
                {k === "todos" ? "Todos" : k === "receita" ? "Receitas" : "Despesas"}
              </button>
            ))}
          </div>
        </div>
        <ul className="divide-y divide-border rounded-3xl border border-border bg-card">
          {list.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-4 py-3">
              <CategoryIcon id={t.category} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-card-foreground">{t.description}</p>
                <p className="text-xs text-muted-foreground">{CATEGORIES[t.category].label} · {new Date(t.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</p>
              </div>
              <p className={`text-sm font-semibold ${t.type === "receita" ? "text-income" : "text-expense"}`}>{t.type === "receita" ? "+" : "−"}{brl(t.amount)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
