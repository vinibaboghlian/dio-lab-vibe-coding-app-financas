import { useCallback, useEffect, useState } from "react";

export type TxType = "despesa" | "receita";
export type CategoryId =
  | "alimentacao"
  | "transporte"
  | "lazer"
  | "moradia"
  | "saude"
  | "compras"
  | "educacao"
  | "salario"
  | "freela"
  | "outros";

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  category: CategoryId;
  description: string;
  date: string; // ISO
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  emoji: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  txId?: string;
}

export const CATEGORIES: Record<CategoryId, { label: string; color: string; keywords: string[] }> = {
  alimentacao: { label: "Alimentação", color: "var(--cat-food)", keywords: ["lanche", "almoço", "almoco", "jantar", "mercado", "ifood", "pizza", "café", "cafe", "comida", "padaria", "restaurante", "açaí", "acai", "hamburguer"] },
  transporte: { label: "Transporte", color: "var(--cat-transport)", keywords: ["uber", "99", "ônibus", "onibus", "metrô", "metro", "gasolina", "combustível", "combustivel", "estacionamento", "táxi", "taxi", "passagem"] },
  lazer: { label: "Lazer", color: "var(--cat-fun)", keywords: ["cinema", "show", "bar", "cerveja", "netflix", "spotify", "jogo", "festa", "balada", "streaming", "viagem"] },
  moradia: { label: "Moradia", color: "var(--cat-home)", keywords: ["aluguel", "luz", "água", "agua", "internet", "condomínio", "condominio", "gás", "gas", "energia"] },
  saude: { label: "Saúde", color: "var(--cat-health)", keywords: ["farmácia", "farmacia", "remédio", "remedio", "médico", "medico", "academia", "dentista", "consulta"] },
  compras: { label: "Compras", color: "var(--cat-shop)", keywords: ["roupa", "tênis", "tenis", "shopping", "presente", "amazon", "celular", "loja"] },
  educacao: { label: "Educação", color: "var(--cat-edu)", keywords: ["curso", "livro", "faculdade", "escola", "aula"] },
  salario: { label: "Salário", color: "var(--cat-income)", keywords: ["salário", "salario", "pagamento"] },
  freela: { label: "Freela", color: "var(--cat-freela)", keywords: ["freela", "freelance", "job", "projeto", "bico"] },
  outros: { label: "Outros", color: "var(--cat-other)", keywords: [] },
};

const INCOME_WORDS = ["caiu", "recebi", "ganhei", "entrou", "salário", "salario", "freela", "rendeu", "vendi", "reembolso"];

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const uid = () => Math.random().toString(36).slice(2, 10);

export function parseMessage(text: string): Omit<Transaction, "id"> | null {
  const t = text.toLowerCase();
  const m = t.match(/(?:r\$\s*)?(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?)\s*(k|mil|reais|conto|pila)?/);
  if (!m) return null;
  let raw = m[1] ?? "";
  if (/\.\d{3}/.test(raw)) raw = raw.replace(/\./g, "");
  let amount = parseFloat(raw.replace(",", "."));
  if (m[2] === "k" || m[2] === "mil") amount *= 1000;
  if (!amount || amount <= 0) return null;

  const type: TxType = INCOME_WORDS.some((w) => t.includes(w)) ? "receita" : "despesa";
  let category: CategoryId = type === "receita" ? "outros" : "outros";
  for (const [id, c] of Object.entries(CATEGORIES) as [CategoryId, (typeof CATEGORIES)[CategoryId]][]) {
    if (c.keywords.some((k) => new RegExp(`(^|\\W)${k}(\\W|$)`).test(t))) {
      const isIncomeCat = id === "salario" || id === "freela";
      if ((type === "receita") === isIncomeCat) { category = id; break; }
    }
  }
  const d = new Date();
  if (t.includes("anteontem")) d.setDate(d.getDate() - 2);
  else if (t.includes("ontem")) d.setDate(d.getDate() - 1);

  const desc = text.replace(/r\$/i, "").trim();
  return { type, amount, category, description: desc.charAt(0).toUpperCase() + desc.slice(1), date: d.toISOString() };
}

const TIPS: Partial<Record<CategoryId, string>> = {
  alimentacao: "Dica: planejar as marmitas da semana pode economizar até 30% com comida. 🍱",
  transporte: "Que tal juntar trajetos curtos num dia só? Seu bolso agradece. 🚌",
  lazer: "Lazer é importante! Só vale definir um teto mensal pra curtir sem culpa. 🎉",
  compras: "Truque das 48h: espere dois dias antes de comprar algo não essencial. 🛍️",
  moradia: "Contas fixas são ótimas candidatas a renegociação uma vez por ano. 🏠",
  saude: "Investir em saúde é investir em você. 💚",
};

export function agentReplyFor(tx: Transaction) {
  const cat = CATEGORIES[tx.category].label;
  if (tx.type === "receita")
    return `Uhul! Registrei ${brl(tx.amount)} de entrada em **${cat}**. 🎉 Que tal separar 10% (${brl(tx.amount * 0.1)}) pra uma meta?`;
  return `Anotado! ${brl(tx.amount)} em **${cat}**. ${TIPS[tx.category] ?? "Se a categoria não estiver certa, é só tocar no card pra ajustar. 😉"}`;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(Math.max(1, d.getDate() - n) === d.getDate() - n ? d.getDate() - n : 1);
  return d.toISOString();
}

const SEED_TX: Transaction[] = [
  { id: uid(), type: "receita", amount: 4200, category: "salario", description: "Salário do mês", date: daysAgo(12) },
  { id: uid(), type: "despesa", amount: 1350, category: "moradia", description: "Aluguel", date: daysAgo(11) },
  { id: uid(), type: "despesa", amount: 412.8, category: "alimentacao", description: "Mercado do mês", date: daysAgo(10) },
  { id: uid(), type: "despesa", amount: 38.5, category: "transporte", description: "Uber pro trabalho", date: daysAgo(8) },
  { id: uid(), type: "receita", amount: 650, category: "freela", description: "Freela de design", date: daysAgo(7) },
  { id: uid(), type: "despesa", amount: 89.9, category: "lazer", description: "Cinema + pipoca", date: daysAgo(5) },
  { id: uid(), type: "despesa", amount: 120, category: "saude", description: "Farmácia", date: daysAgo(4) },
  { id: uid(), type: "despesa", amount: 199.9, category: "compras", description: "Tênis novo", date: daysAgo(3) },
  { id: uid(), type: "despesa", amount: 32, category: "alimentacao", description: "Lanche da tarde", date: daysAgo(1) },
];

const SEED_GOALS: Goal[] = [
  { id: uid(), name: "Reserva de Emergência", target: 10000, saved: 6000, emoji: "🛟" },
  { id: uid(), name: "Viagem de Férias", target: 6000, saved: 2100, emoji: "✈️" },
];

const SEED_CHAT: ChatMessage[] = [
  { id: uid(), role: "agent", text: "Oi! Eu sou o **Finny**, seu parceiro de grana. 💸 Me conta seus gastos e entradas do jeito que você falaria com um amigo — tipo *\"gastei 30 no lanche\"* ou *\"caiu meu freela de 400\"*." },
];

function usePersisted<T>(key: string, seed: T) {
  const [v, setV] = useState<T>(seed);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setV(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready) localStorage.setItem(key, JSON.stringify(v));
  }, [key, v, ready]);
  return [v, setV] as const;
}

export function useFinance() {
  const [transactions, setTx] = usePersisted<Transaction[]>("finny:tx", SEED_TX);
  const [goals, setGoals] = usePersisted<Goal[]>("finny:goals", SEED_GOALS);
  const [chat, setChat] = usePersisted<ChatMessage[]>("finny:chat", SEED_CHAT);

  const income = transactions.filter((t) => t.type === "receita").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "despesa").reduce((s, t) => s + t.amount, 0);

  const addAgent = useCallback((text: string) => setChat((c) => [...c, { id: uid(), role: "agent", text }]), [setChat]);

  const send = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = { id: uid(), role: "user", text };
      const parsed = parseMessage(text);
      if (!parsed) {
        setChat((c) => [...c, userMsg, { id: uid(), role: "agent", text: "Hmm, não achei um valor aí. 🤔 Tenta algo como *\"paguei 50 de uber\"* ou *\"recebi 1.200 de salário\"*." }]);
        return;
      }
      const tx: Transaction = { ...parsed, id: uid() };
      setTx((t) => [tx, ...t]);
      setChat((c) => [...c, userMsg, { id: uid(), role: "agent", text: agentReplyFor(tx), txId: tx.id }]);
    },
    [setChat, setTx],
  );

  const updateTx = (id: string, patch: Partial<Transaction>) => setTx((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const deleteTx = (id: string) => setTx((t) => t.filter((x) => x.id !== id));

  const insight = (kind: "dica" | "meta" | "resumo") => {
    const byCat = expensesByCategory(transactions);
    if (kind === "dica") {
      const top = byCat[0];
      addAgent(top
        ? `💡 Seu maior gasto é **${CATEGORIES[top.id].label}** (${brl(top.value)}). Cortar só 15% aí já libera ${brl(top.value * 0.15)} por mês pras suas metas!`
        : "💡 Ainda não tenho gastos pra analisar. Me conta o primeiro!");
    } else if (kind === "meta") {
      addAgent("🎯 " + goals.map((g) => `**${g.name}**: ${Math.round((g.saved / g.target) * 100)}% (${brl(g.saved)} de ${brl(g.target)})`).join(" · ") + " — você tá no caminho certo!");
    } else {
      const week = transactions.filter((t) => Date.now() - new Date(t.date).getTime() < 7 * 864e5);
      const wOut = week.filter((t) => t.type === "despesa").reduce((s, t) => s + t.amount, 0);
      const wIn = week.filter((t) => t.type === "receita").reduce((s, t) => s + t.amount, 0);
      addAgent(`📊 Nos últimos 7 dias: entraram **${brl(wIn)}** e saíram **${brl(wOut)}** em ${week.length} lançamentos. Saldo do mês: **${brl(income - expense)}**.`);
    }
  };

  const addGoal = (g: Omit<Goal, "id">) => setGoals((x) => [...x, { ...g, id: uid() }]);
  const depositGoal = (id: string, value: number) => setGoals((x) => x.map((g) => (g.id === id ? { ...g, saved: Math.min(g.target, g.saved + value) } : g)));
  const deleteGoal = (id: string) => setGoals((x) => x.filter((g) => g.id !== id));

  return { transactions, goals, chat, income, expense, balance: income - expense, send, updateTx, deleteTx, insight, addGoal, depositGoal, deleteGoal };
}

export function expensesByCategory(txs: Transaction[]) {
  const map = new Map<CategoryId, number>();
  txs.filter((t) => t.type === "despesa").forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + t.amount));
  return [...map.entries()].map(([id, value]) => ({ id, value })).sort((a, b) => b.value - a.value);
}
