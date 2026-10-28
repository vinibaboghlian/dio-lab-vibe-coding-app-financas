import { Utensils, Car, PartyPopper, Home, HeartPulse, ShoppingBag, GraduationCap, Wallet, Laptop, Circle } from "lucide-react";
import { CATEGORIES, type CategoryId } from "@/lib/finance";

const ICONS = { alimentacao: Utensils, transporte: Car, lazer: PartyPopper, moradia: Home, saude: HeartPulse, compras: ShoppingBag, educacao: GraduationCap, salario: Wallet, freela: Laptop, outros: Circle };

export function CategoryIcon({ id, size = "md" }: { id: CategoryId; size?: "sm" | "md" }) {
  const Icon = ICONS[id];
  const color = CATEGORIES[id].color;
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-2xl ${size === "sm" ? "h-9 w-9" : "h-11 w-11"}`}
      style={{ background: `color-mix(in oklab, ${color} 18%, transparent)`, color }}
    >
      <Icon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
    </span>
  );
}

export function CategoryBadge({ id }: { id: CategoryId }) {
  const color = CATEGORIES[id].color;
  return (
    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: `color-mix(in oklab, ${color} 18%, transparent)`, color }}>
      {CATEGORIES[id].label}
    </span>
  );
}
