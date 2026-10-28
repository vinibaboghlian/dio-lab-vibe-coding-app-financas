import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageCircle, PieChart, Target, Moon, Sun } from "lucide-react";
import { useFinance } from "@/lib/finance";
import { ChatTab } from "@/components/finny/ChatTab";
import { DashboardTab } from "@/components/finny/DashboardTab";
import { GoalsTab } from "@/components/finny/GoalsTab";
import finnyAvatar from "@/assets/finny.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Finny — Suas finanças numa conversa" },
      { name: "description", content: "Registre gastos e receitas conversando com o Finny, acompanhe metas e veja seu mês num painel simples." },
      { property: "og:title", content: "Finny — Suas finanças numa conversa" },
      { property: "og:description", content: "Controle financeiro sem planilhas: é só conversar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Tab = "chat" | "dash" | "goals";

function Index() {
  const f = useFinance();
  const [tab, setTab] = useState<Tab>("chat");
  const [dark, setDark] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  const tabs = [
    { id: "chat" as const, label: "Conversa", icon: MessageCircle },
    { id: "dash" as const, label: "Visão geral", icon: PieChart },
    { id: "goals" as const, label: "Metas", icon: Target },
  ];

  return (
    <div className="flex min-h-screen justify-center bg-muted">
      <div className="relative flex h-dvh w-full max-w-md flex-col bg-background shadow-glow">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="relative">
            <img src={finnyAvatar} alt="Finny" className="h-11 w-11 rounded-2xl bg-accent object-cover" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-income" />
          </div>
          <div className="flex-1">
            <p className="font-display text-base font-bold leading-tight">Finny</p>
            <p className="text-xs text-income">online · seu parceiro de grana</p>
          </div>
          <button onClick={() => setDark((d) => !d)} aria-label="Alternar tema" className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-secondary-foreground">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </header>

        <main className="min-h-0 flex-1 overflow-hidden [&>div]:h-full">
          {tab === "chat" && <ChatTab f={f} />}
          {tab === "dash" && <DashboardTab f={f} />}
          {tab === "goals" && <GoalsTab f={f} />}
        </main>

        <nav className="grid grid-cols-3 border-t border-border bg-background px-2 pb-[env(safe-area-inset-bottom)]">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition ${tab === id ? "text-primary" : "text-muted-foreground"}`}>
              <span className={`grid h-8 w-14 place-items-center rounded-full transition ${tab === id ? "bg-accent" : ""}`}><Icon className="h-5 w-5" /></span>
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
