import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

/* ═══════════════════════════════════════
   TYPES
═══════════════════════════════════════ */
type Section = "dashboard" | "orders" | "catalog" | "settings";

type KanbanStatus = "new" | "talking" | "paid" | "rejected";

type Order = {
  id: number;
  name: string;
  phone: string;
  email?: string;
  product_name?: string;
  message?: string;
  delivery_address?: string;
  budget_min?: number;
  budget_max?: number;
  deal_amount?: number;
  commission_amount?: number;
  commission_rate: number;
  commission_paid: boolean;
  source?: string;
  messenger?: string;
  notes?: string;
  status: string;
  kanban_status: string;
  created_at: string;
};

type Product = {
  id: number;
  name: string;
  type: string;
  description?: string;
  price: number;
  dimensions?: string;
  square_meters?: number;
  status: string;
  image_url?: string;
  is_featured: boolean;
  created_at: string;
};

/* ═══════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */
const COMMISSION = 0.05;

const COLS: { id: KanbanStatus; label: string; color: string }[] = [
  { id: "new",      label: "Новая",    color: "#60a5fa" },
  { id: "talking",  label: "Общение",  color: "#a78bfa" },
  { id: "paid",     label: "Оплачено", color: "#34d399" },
  { id: "rejected", label: "Отказ",    color: "#f87171" },
];

const STATUS_MAP: Record<string, KanbanStatus> = {
  new: "new", contacted: "talking", sent_calc: "talking",
  waiting: "talking", production: "talking", delivery: "talking",
  done: "paid", rejected: "rejected", cancelled: "rejected",
};

const PRODUCT_TYPES = ["Бытовка", "Дачный домик", "Баня", "Хостблок", "Блок-контейнер", "Хозблок"];

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
function fmtMoney(n: number | undefined) {
  if (!n) return "—";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)} млн ₽`;
  if (n >= 1000) return `${Math.round(n / 1000)} тыс ₽`;
  return `${n} ₽`;
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

function toKanban(o: Order): KanbanStatus {
  return (STATUS_MAP[o.kanban_status] || STATUS_MAP[o.status] || "new") as KanbanStatus;
}

/* ═══════════════════════════════════════
   CSS tokens (inline style vars)
═══════════════════════════════════════ */
const C = {
  bg:      "#141414",
  surface: "#1c1c1c",
  card:    "#222222",
  border:  "rgba(255,255,255,0.07)",
  text:    "#f0f0f0",
  muted:   "#777",
  red:     "#e53935",
};

/* ═══════════════════════════════════════
   SMALL SHARED COMPONENTS
═══════════════════════════════════════ */
function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "8px 0" }} />;
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
      background: color + "18", color: color, border: `1px solid ${color}30`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, display: "inline-block" }} />
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════
   LOGIN
═══════════════════════════════════════ */
function Login({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr("");
    const r = await api.login(pw);
    setBusy(false);
    if (r.token) { localStorage.setItem("admin_token", r.token); onLogin(); }
    else setErr("Неверный пароль");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 360, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "32px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Building2" size={16} className="text-white" />
          </div>
          <div>
            <p style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>МодульСтрой</p>
            <p style={{ color: C.muted, fontSize: 12 }}>Агентская панель</p>
          </div>
        </div>
        <form onSubmit={submit}>
          <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Пароль</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} autoFocus required
            style={{ width: "100%", height: 40, borderRadius: 10, border: `1px solid ${C.border}`, background: C.card, color: C.text, padding: "0 12px", fontSize: 14, outline: "none" }} />
          {err && <p style={{ color: "#f87171", fontSize: 12, marginTop: 8 }}>{err}</p>}
          <button type="submit" disabled={busy}
            style={{ marginTop: 16, width: "100%", height: 40, borderRadius: 10, background: C.red, color: "#fff", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
            {busy ? "Входим…" : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════ */
const NAV: { id: Section; icon: string; label: string }[] = [
  { id: "dashboard", icon: "LayoutDashboard", label: "Дашборд" },
  { id: "orders",    icon: "ClipboardList",   label: "Заявки" },
  { id: "catalog",   icon: "Package",          label: "Каталог" },
  { id: "settings",  icon: "Settings",         label: "Настройки" },
];

function Sidebar({ active, onSelect, onLogout, newCount }: {
  active: Section; onSelect: (s: Section) => void; onLogout: () => void; newCount: number;
}) {
  return (
    <aside style={{ width: 200, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, flexShrink: 0 }}>
      {/* logo */}
      <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="Building2" size={14} className="text-white" />
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 13, color: C.text }}>МодульСтрой</p>
          <p style={{ fontSize: 10, color: C.muted }}>CRM</p>
        </div>
      </div>

      {/* nav */}
      <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map(n => {
          const isActive = active === n.id;
          return (
            <button key={n.id} onClick={() => onSelect(n.id)}
              style={{
                display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 9,
                border: "none", cursor: "pointer", textAlign: "left", width: "100%", fontSize: 13, fontWeight: 500,
                background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                color: isActive ? C.text : C.muted,
                position: "relative",
              }}>
              <Icon name={n.icon} size={16} />
              {n.label}
              {n.id === "orders" && newCount > 0 && (
                <span style={{ marginLeft: "auto", minWidth: 18, height: 18, borderRadius: 9, background: C.red, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>
                  {newCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* bottom */}
      <div style={{ padding: "10px 8px", borderTop: `1px solid ${C.border}` }}>
        <Link to="/" target="_blank" style={{ textDecoration: "none" }}>
          <button style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 9, border: "none", cursor: "pointer", width: "100%", fontSize: 12, color: C.muted, background: "transparent" }}>
            <Icon name="ExternalLink" size={14} /> Открыть сайт
          </button>
        </Link>
        <button onClick={onLogout}
          style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 9, border: "none", cursor: "pointer", width: "100%", fontSize: 12, color: C.muted, background: "transparent" }}>
          <Icon name="LogOut" size={14} /> Выйти
        </button>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════ */
const PERIODS = [
  { id: "today", label: "Сегодня" },
  { id: "week",  label: "7 дней" },
  { id: "month", label: "30 дней" },
  { id: "all",   label: "Всё время" },
];

function filterByPeriod(orders: Order[], period: string): Order[] {
  const now = new Date();
  return orders.filter(o => {
    const d = new Date(o.created_at);
    if (period === "today") return d.toDateString() === now.toDateString();
    if (period === "week")  return (now.getTime() - d.getTime()) < 7 * 86400000;
    if (period === "month") return (now.getTime() - d.getTime()) < 30 * 86400000;
    return true;
  });
}

const STATUS_LABEL: Record<string, string> = { new: "Новая", talking: "Общение", paid: "Оплачено", rejected: "Отказ" };
const STATUS_COLOR: Record<string, string> = { new: "#60a5fa", talking: "#a78bfa", paid: "#34d399", rejected: "#f87171" };

function Dashboard({ orders }: { orders: Order[] }) {
  const [period, setPeriod] = useState("all");
  const [calcSum, setCalcSum] = useState("");

  const filtered = filterByPeriod(orders, period);
  const newOrders  = filtered.filter(o => toKanban(o) === "new").length;
  const talking    = filtered.filter(o => toKanban(o) === "talking").length;
  const paid       = filtered.filter(o => toKanban(o) === "paid");
  const revenue    = paid.reduce((s, o) => s + (o.deal_amount || 0), 0);
  const commission = paid.reduce((s, o) => s + (o.commission_amount || Math.round((o.deal_amount || 0) * COMMISSION)), 0);

  const calcVal = parseFloat(calcSum.replace(/\D/g, "")) || 0;
  const calcComm = Math.round(calcVal * COMMISSION);

  const kpis = [
    { label: "Новые заявки",   value: String(newOrders),      icon: "Inbox",        color: "#60a5fa" },
    { label: "В общении",      value: String(talking),        icon: "MessageSquare", color: "#a78bfa" },
    { label: "Оплачено",       value: fmtMoney(revenue),      icon: "CheckCircle",   color: "#34d399" },
    { label: "Комиссия (5%)",  value: fmtMoney(commission),   icon: "Wallet",        color: C.red },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Дашборд</h1>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Обзор продаж и комиссий</p>
        </div>
        {/* Period filter */}
        <div style={{ display: "flex", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          {PERIODS.map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)}
              style={{ padding: "6px 14px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500,
                background: period === p.id ? "rgba(255,255,255,0.1)" : "transparent",
                color: period === p.id ? C.text : C.muted }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <Icon name={k.icon} size={18} style={{ color: k.color }} />
            </div>
            <p style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>{k.value}</p>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Bottom row: table + calculator */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 12 }}>
        {/* Recent orders table */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontWeight: 600, fontSize: 14, color: C.text }}>Последние заявки</p>
            <p style={{ fontSize: 12, color: C.muted }}>{filtered.length} шт.</p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Клиент","Товар","Сумма","Комиссия","Статус","Дата"].map(h => (
                  <th key={h} style={{ padding: "8px 18px", textAlign: "left", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", color: C.muted, fontSize: 13 }}>Нет заявок за этот период</td></tr>
              )}
              {filtered.slice(0, 10).map(o => {
                const ks = toKanban(o);
                const comm = o.commission_amount || Math.round((o.deal_amount || 0) * COMMISSION);
                return (
                  <tr key={o.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 18px" }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{o.name}</p>
                      <p style={{ fontSize: 11, color: C.muted }}>{o.phone}</p>
                    </td>
                    <td style={{ padding: "10px 18px", fontSize: 12, color: C.muted, maxWidth: 140 }}>
                      <p style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.product_name || "—"}</p>
                    </td>
                    <td style={{ padding: "10px 18px", fontSize: 13, fontWeight: 600, color: C.text }}>{fmtMoney(o.deal_amount)}</td>
                    <td style={{ padding: "10px 18px", fontSize: 13, fontWeight: 600, color: "#34d399" }}>{o.deal_amount ? fmtMoney(comm) : "—"}</td>
                    <td style={{ padding: "10px 18px" }}><Badge label={STATUS_LABEL[ks] || ks} color={STATUS_COLOR[ks] || C.muted} /></td>
                    <td style={{ padding: "10px 18px", fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>{fmtDate(o.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Commission calculator */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, color: C.text }}>Калькулятор комиссии</p>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Ставка агента — 5%</p>
          </div>
          <Divider />
          <div>
            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Сумма сделки (₽)</label>
            <input
              type="text"
              value={calcSum}
              onChange={e => setCalcSum(e.target.value)}
              placeholder="300 000"
              style={{ width: "100%", height: 42, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, color: C.text, padding: "0 12px", fontSize: 16, fontWeight: 600, outline: "none" }}
            />
          </div>
          <div style={{ padding: 14, borderRadius: 12, background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.15)" }}>
            <p style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Ваша комиссия</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#34d399", letterSpacing: "-0.03em" }}>
              {calcVal > 0 ? fmtMoney(calcComm) : "—"}
            </p>
            {calcVal > 0 && (
              <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                {calcVal.toLocaleString("ru-RU")} ₽ × 5%
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   KANBAN
═══════════════════════════════════════ */
function OrderPanel({ order, onClose, onSave }: { order: Order | null; onClose: () => void; onSave: (o: Partial<Order>) => void }) {
  const [form, setForm] = useState<Partial<Order>>(order || {});
  const [busy, setBusy] = useState(false);

  useEffect(() => { setForm(order || {}); }, [order]);

  if (!order) return null;
  const isNew = order.id === 0;

  const deal = form.deal_amount || 0;
  const comm = Math.round(deal * ((form.commission_rate || 5) / 100));

  const submit = async () => {
    setBusy(true);
    const data = { ...form, commission_amount: comm };
    if (isNew) await api.createOrder(data);
    else await api.updateOrder(data);
    setBusy(false);
    onSave(data);
  };

  const field = (label: string, val: string, set: (v: string) => void, type = "text") => (
    <div>
      <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>{label}</label>
      <input type={type} value={val} onChange={e => set(e.target.value)}
        style={{ width: "100%", height: 38, borderRadius: 9, border: `1px solid ${C.border}`, background: C.card, color: C.text, padding: "0 10px", fontSize: 13, outline: "none" }} />
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }} onClick={onClose}>
      <div style={{ flex: 1, background: "rgba(0,0,0,0.5)" }} />
      <div style={{ width: 400, background: C.surface, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        {/* header */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{isNew ? "Новая заявка" : order.name}</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}>
            <Icon name="X" size={18} />
          </button>
        </div>

        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
          {/* status pills */}
          {!isNew && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
              {COLS.map(col => (
                <button key={col.id} onClick={() => setForm({ ...form, kanban_status: col.id })}
                  style={{
                    padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${col.color}40`,
                    background: form.kanban_status === col.id ? col.color + "25" : "transparent",
                    color: form.kanban_status === col.id ? col.color : C.muted,
                  }}>
                  {col.label}
                </button>
              ))}
            </div>
          )}

          {field("Имя клиента", form.name || "", v => setForm({ ...form, name: v }))}
          {field("Телефон", form.phone || "", v => setForm({ ...form, phone: v }))}
          {field("Telegram / WhatsApp", form.messenger || "", v => setForm({ ...form, messenger: v }))}

          <div>
            <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>Тип строения</label>
            <select value={form.product_name || ""} onChange={e => setForm({ ...form, product_name: e.target.value })}
              style={{ width: "100%", height: 38, borderRadius: 9, border: `1px solid ${C.border}`, background: C.card, color: C.text, padding: "0 10px", fontSize: 13, outline: "none" }}>
              <option value="">Не указано</option>
              {PRODUCT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* finances */}
          <div style={{ background: C.card, borderRadius: 12, padding: 14, border: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>Финансы</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>Сумма сделки (₽)</label>
                <input type="number" value={form.deal_amount || ""} onChange={e => setForm({ ...form, deal_amount: +e.target.value })}
                  style={{ width: "100%", height: 38, borderRadius: 9, border: `1px solid ${C.border}`, background: C.surface, color: C.text, padding: "0 10px", fontSize: 14, fontWeight: 600, outline: "none" }} />
              </div>
              {deal > 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 8, background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.15)" }}>
                  <p style={{ fontSize: 12, color: C.muted }}>Комиссия (5%)</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#34d399" }}>{fmtMoney(comm)}</p>
                </div>
              )}
              {!isNew && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 12, color: C.muted }}>Комиссия выплачена</p>
                  <button onClick={() => setForm({ ...form, commission_paid: !form.commission_paid })}
                    style={{ width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer", transition: "background 0.2s",
                      background: form.commission_paid ? "#34d399" : "rgba(255,255,255,0.12)" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", margin: "3px", transform: form.commission_paid ? "translateX(18px)" : "translateX(0)", transition: "transform 0.2s" }} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>Комментарий</label>
            <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3}
              placeholder="Заметки менеджера…"
              style={{ width: "100%", borderRadius: 9, border: `1px solid ${C.border}`, background: C.card, color: C.text, padding: "8px 10px", fontSize: 13, outline: "none", resize: "vertical" }} />
          </div>
        </div>

        <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
          <button onClick={onClose}
            style={{ flex: 1, height: 38, borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 13, cursor: "pointer" }}>
            Отмена
          </button>
          <button onClick={submit} disabled={busy}
            style={{ flex: 1, height: 38, borderRadius: 10, border: "none", background: C.red, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
            {busy ? "Сохраняем…" : isNew ? "Создать" : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}

function KanbanBoard({ orders, onRefresh }: { orders: Order[]; onRefresh: () => void }) {
  const [selected, setSelected] = useState<Order | null>(null);
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const newOrderTemplate: Order = { id: 0, name: "", phone: "", status: "new", kanban_status: "new", commission_rate: 5, commission_paid: false, created_at: new Date().toISOString() };

  const drop = async (colId: string) => {
    if (!dragId) return;
    const o = orders.find(o => o.id === dragId);
    if (o && o.kanban_status !== colId) await api.updateOrder({ ...o, kanban_status: colId });
    onRefresh(); setDragId(null); setDragOver(null);
  };

  const savePanel = async () => { onRefresh(); setSelected(null); };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Заявки</h1>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Kanban · {orders.length} заявок</p>
        </div>
        <button onClick={() => setSelected(newOrderTemplate)}
          style={{ display: "flex", alignItems: "center", gap: 7, height: 36, padding: "0 16px", borderRadius: 10, border: "none", background: C.red, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Icon name="Plus" size={14} /> Новая заявка
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
        {COLS.map(col => {
          const colOrders = orders.filter(o => toKanban(o) === col.id);
          const isTarget = dragOver === col.id;
          return (
            <div key={col.id} style={{ width: 230, flexShrink: 0, borderRadius: 14,
              background: isTarget ? col.color + "0a" : C.card,
              border: `1px solid ${isTarget ? col.color + "40" : C.border}`,
              transition: "all 0.15s" }}
              onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => drop(col.id)}>
              {/* col header */}
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: col.color, display: "inline-block" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{col.label}</span>
                </div>
                <span style={{ fontSize: 11, color: C.muted, background: "rgba(255,255,255,0.06)", padding: "1px 7px", borderRadius: 10 }}>{colOrders.length}</span>
              </div>
              {/* cards */}
              <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: 6, minHeight: 80 }}>
                {colOrders.map(o => {
                  const deal = o.deal_amount || 0;
                  const comm = o.commission_amount || Math.round(deal * COMMISSION);
                  return (
                    <div key={o.id} draggable onDragStart={() => setDragId(o.id)} onClick={() => setSelected(o)}
                      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>{o.name}</p>
                      <p style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{o.phone}</p>
                      {o.product_name && <p style={{ fontSize: 11, color: C.muted, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.product_name}</p>}
                      {deal > 0 && (
                        <div style={{ display: "flex", gap: 8, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{fmtMoney(deal)}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#34d399" }}>{fmtMoney(comm)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                {colOrders.length === 0 && <p style={{ fontSize: 12, color: C.muted, textAlign: "center", padding: 12 }}>Пусто</p>}
              </div>
            </div>
          );
        })}
      </div>

      {selected && <OrderPanel order={selected} onClose={() => setSelected(null)} onSave={savePanel} />}
    </div>
  );
}

/* ═══════════════════════════════════════
   CATALOG
═══════════════════════════════════════ */
function CatalogView({ products, onRefresh }: { products: Product[]; onRefresh: () => void }) {
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Бытовка", description: "", price: "", dimensions: "", square_meters: "", status: "available", image_url: "", is_featured: false });
  const [photos, setPhotos] = useState<string[]>([]);
  const [mainPhotoIdx, setMainPhotoIdx] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const openNew = () => {
    setEditProduct(null);
    setForm({ name: "", type: "Бытовка", description: "", price: "", dimensions: "", square_meters: "", status: "available", image_url: "", is_featured: false });
    setPhotos([]);
    setMainPhotoIdx(0);
    setFormOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ name: p.name, type: p.type, description: p.description || "", price: String(p.price), dimensions: p.dimensions || "", square_meters: String(p.square_meters || ""), status: p.status, image_url: p.image_url || "", is_featured: p.is_featured });
    setPhotos(p.image_url ? [p.image_url] : []);
    setMainPhotoIdx(0);
    setFormOpen(true);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const url = e.target?.result as string;
        setPhotos(prev => [...prev, url]);
      };
      reader.readAsDataURL(file);
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const mainPhoto = photos[mainPhotoIdx] || form.image_url || "";
    const data = { ...form, price: parseInt(form.price) || 0, square_meters: parseFloat(form.square_meters) || null, image_url: mainPhoto, ...(editProduct ? { id: editProduct.id } : {}) };
    if (editProduct) await api.updateProduct(data);
    else await api.createProduct(data);
    setBusy(false);
    setFormOpen(false);
    onRefresh();
  };

  const inputStyle: React.CSSProperties = { width: "100%", height: 38, borderRadius: 9, border: `1px solid ${C.border}`, background: C.card, color: C.text, padding: "0 10px", fontSize: 13, outline: "none" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Каталог</h1>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{products.length} товаров</p>
        </div>
        <button onClick={openNew}
          style={{ display: "flex", alignItems: "center", gap: 7, height: 36, padding: "0 16px", borderRadius: 10, border: "none", background: C.red, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Icon name="Plus" size={14} /> Добавить
        </button>
      </div>

      {/* Products grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {products.length === 0 && <p style={{ color: C.muted, fontSize: 14, gridColumn: "1/-1", textAlign: "center", padding: 40 }}>Товаров нет. Добавьте первый!</p>}
        {products.map(p => (
          <div key={p.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ height: 130, background: "#2a2a2a", position: "relative" }}>
              {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="Package" size={32} style={{ color: C.muted }} />
                </div>
              )}
              {p.is_featured && (
                <span style={{ position: "absolute", top: 8, left: 8, background: C.red, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>ХИТ</span>
              )}
            </div>
            <div style={{ padding: "12px" }}>
              <p style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>{p.type}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>{p.name}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>{fmtMoney(p.price)}</p>
              <button onClick={() => openEdit(p)}
                style={{ width: "100%", height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <Icon name="Pencil" size={13} /> Редактировать
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form modal */}
      {formOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}
          onClick={() => setFormOpen(false)}>
          <div style={{ width: 520, maxHeight: "90vh", overflowY: "auto", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{editProduct ? "Редактировать товар" : "Новый товар"}</p>
              <button onClick={() => setFormOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><Icon name="X" size={18} /></button>
            </div>
            <form onSubmit={save} style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", maxHeight: "75vh" }}>
              {/* Photo upload area */}
              <div>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Фотографии</p>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                  style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: "20px", textAlign: "center", cursor: "pointer", background: C.card }}>
                  <Icon name="Upload" size={24} style={{ color: C.muted, margin: "0 auto 8px" }} />
                  <p style={{ fontSize: 13, color: C.muted }}>Перетащите фото или <span style={{ color: C.red }}>выберите файлы</span></p>
                  <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>PNG, JPG — несколько файлов</p>
                  <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                    onChange={e => handleFiles(e.target.files)} />
                </div>

                {/* Also allow URL */}
                <div style={{ marginTop: 10 }}>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>или вставьте URL фото</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })}
                      placeholder="https://…" style={{ ...inputStyle, flex: 1 }} />
                    <button type="button" onClick={() => { if (form.image_url) { setPhotos(prev => [...prev, form.image_url]); setForm({ ...form, image_url: "" }); } }}
                      style={{ height: 38, padding: "0 14px", borderRadius: 9, border: `1px solid ${C.border}`, background: "transparent", color: C.text, fontSize: 12, cursor: "pointer" }}>
                      Добавить
                    </button>
                  </div>
                </div>

                {/* Photo previews */}
                {photos.length > 0 && (
                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    {photos.map((src, i) => (
                      <div key={i} onClick={() => setMainPhotoIdx(i)}
                        style={{ position: "relative", width: 72, height: 72, borderRadius: 8, overflow: "hidden", cursor: "pointer",
                          border: `2px solid ${i === mainPhotoIdx ? "#34d399" : C.border}` }}>
                        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        {i === mainPhotoIdx && (
                          <div style={{ position: "absolute", bottom: 2, left: 0, right: 0, textAlign: "center", fontSize: 9, color: "#fff", background: "rgba(52,211,153,0.8)", padding: 2 }}>ГЛАВНОЕ</div>
                        )}
                        <button type="button" onClick={e => { e.stopPropagation(); setPhotos(prev => prev.filter((_, j) => j !== i)); if (mainPhotoIdx >= photos.length - 1) setMainPhotoIdx(0); }}
                          style={{ position: "absolute", top: 3, right: 3, width: 18, height: 18, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>Название *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>Тип</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ ...inputStyle }}>
                    {PRODUCT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>Цена (₽) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>Размеры</label>
                  <input placeholder="6×3×2.7 м" value={form.dimensions} onChange={e => setForm({ ...form, dimensions: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>Площадь (м²)</label>
                  <input type="number" step="0.1" value={form.square_meters} onChange={e => setForm({ ...form, square_meters: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>Описание</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                    style={{ ...inputStyle, height: "auto", padding: "8px 10px", resize: "vertical" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>Статус</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ ...inputStyle }}>
                    <option value="available">Доступно</option>
                    <option value="sold">Продано</option>
                    <option value="archived">Архив</option>
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 18 }}>
                  <button type="button" onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                    style={{ width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: form.is_featured ? "#34d399" : "rgba(255,255,255,0.12)" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", margin: "3px", transform: form.is_featured ? "translateX(18px)" : "translateX(0)", transition: "transform 0.2s" }} />
                  </button>
                  <label style={{ fontSize: 13, color: C.muted }}>Показывать на главной</label>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                <button type="button" onClick={() => setFormOpen(false)}
                  style={{ flex: 1, height: 40, borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 13, cursor: "pointer" }}>
                  Отмена
                </button>
                <button type="submit" disabled={busy}
                  style={{ flex: 1, height: 40, borderRadius: 10, border: "none", background: C.red, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
                  {busy ? "Сохраняем…" : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SETTINGS
═══════════════════════════════════════ */
function Settings({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{ maxWidth: 500 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>Настройки</h1>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Параметры агентской панели</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { icon: "Percent",   title: "Ставка комиссии",  desc: "5% от суммы сделки. Изменяется в каждой заявке индивидуально." },
          { icon: "Building2", title: "Компания",          desc: "МодульСтрой — производство модульных строений на металлокаркасе." },
          { icon: "Shield",    title: "Безопасность",      desc: "Пароль задаётся в настройках сервера." },
        ].map(s => (
          <div key={s.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", display: "flex", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(229,57,53,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={s.icon} size={17} style={{ color: C.red }} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 3 }}>{s.title}</p>
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 8 }}>
          <button onClick={onLogout}
            style={{ display: "flex", alignItems: "center", gap: 8, height: 38, padding: "0 18px", borderRadius: 10, border: `1px solid rgba(248,113,113,0.3)`, background: "rgba(248,113,113,0.08)", color: "#f87171", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Icon name="LogOut" size={15} /> Выйти из панели
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN
═══════════════════════════════════════ */
export default function Admin() {
  const [authed,   setAuthed]   = useState(false);
  const [checking, setChecking] = useState(true);
  const [section,  setSection]  = useState<Section>("dashboard");
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const load = useCallback(async () => {
    const [o, p] = await Promise.all([api.getOrders(), api.getProducts()]);
    if (Array.isArray(o)) setOrders(o);
    if (Array.isArray(p)) setProducts(p);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { setChecking(false); return; }
    api.checkAuth().then(r => {
      if (r.ok) { setAuthed(true); load(); }
      setChecking(false);
    });
  }, [load]);

  const logout = () => { localStorage.removeItem("admin_token"); setAuthed(false); };

  if (checking) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: `2px solid ${C.red}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!authed) return <Login onLogin={() => { setAuthed(true); load(); }} />;

  const newCount = orders.filter(o => toKanban(o) === "new").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <Sidebar active={section} onSelect={setSection} onLogout={logout} newCount={newCount} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* topbar */}
        <div style={{ height: 52, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: C.surface, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}>
            <Icon name="Building2" size={13} style={{ color: C.red }} />
            <span>МодульСтрой</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span style={{ color: C.text }}>{NAV.find(n => n.id === section)?.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {newCount > 0 && (
              <button onClick={() => setSection("orders")}
                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "4px 12px", borderRadius: 20, border: `1px solid rgba(229,57,53,0.3)`, background: "rgba(229,57,53,0.1)", color: C.red, cursor: "pointer" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.red, animation: "pulse 1.5s infinite" }} />
                {newCount} новых
              </button>
            )}
            <button onClick={load} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 6, borderRadius: 8 }}>
              <Icon name="RefreshCw" size={14} />
            </button>
          </div>
        </div>

        {/* content */}
        <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          {section === "dashboard" && <Dashboard orders={orders} />}
          {section === "orders"    && <KanbanBoard orders={orders} onRefresh={load} />}
          {section === "catalog"   && <CatalogView products={products} onRefresh={load} />}
          {section === "settings"  && <Settings onLogout={logout} />}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }`}</style>
    </div>
  );
}
