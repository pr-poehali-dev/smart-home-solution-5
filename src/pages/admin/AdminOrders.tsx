import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { MOCK_ORDERS, KANBAN_COLUMNS, COMMISSION_RATE, type Order, type OrderStatus } from "./data";

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

const STATUS_META: Record<OrderStatus, { label: string; color: string }> = {
  new: { label: "Новая", color: "#3B82F6" },
  contacted: { label: "Связались", color: "#8B5CF6" },
  estimate_sent: { label: "Расчёт отправлен", color: "#F59E0B" },
  waiting: { label: "Ожидание", color: "#64748B" },
  production: { label: "Производство", color: "#F97316" },
  delivery: { label: "Доставка", color: "#06B6D4" },
  done: { label: "Завершено", color: "#10B981" },
  cancelled: { label: "Отказ", color: "#EF4444" },
};

const MESSENGER_ICON: Record<string, string> = { telegram: "Send", whatsapp: "MessageCircle", phone: "Phone" };

function OrderCard({ order, onClick, onDragStart }: { order: Order; onClick: () => void; onDragStart: () => void }) {
  const commission = order.deal_amount > 0 ? order.commission : Math.round(order.budget * COMMISSION_RATE);
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="rounded-xl p-3.5 cursor-pointer group transition-all duration-200 hover:scale-[1.01] hover:shadow-xl"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: "rgba(220,38,38,0.25)", color: "#DC2626" }}>{order.name[0]}</div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">{order.name}</p>
            <p className="text-white/40 text-xs">{order.phone}</p>
          </div>
        </div>
        <Icon name={MESSENGER_ICON[order.messenger]} size={13} className="text-white/30 shrink-0 mt-0.5" />
      </div>

      <div className="rounded-lg px-2.5 py-1.5 mb-2.5 flex items-center gap-2" style={{ background: "rgba(255,255,255,0.04)" }}>
        <Icon name="Package" size={12} className="text-white/40 shrink-0" />
        <p className="text-white/70 text-xs truncate">{order.product_name}</p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-bold">₽ {fmt(order.budget)}</p>
          <p className="text-emerald-400 text-xs">+₽ {fmt(commission)} комиссия</p>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-xs">{order.source}</p>
          <p className="text-white/25 text-xs">{new Date(order.created_at).toLocaleDateString("ru-RU", { day: "2-digit", month: "short" })}</p>
        </div>
      </div>
    </div>
  );
}

function SidePanel({ order, onClose, onStatusChange }: { order: Order; onClose: () => void; onStatusChange: (id: number, status: OrderStatus) => void }) {
  const [comment, setComment] = useState("");
  const commission = order.deal_amount > 0 ? order.commission : Math.round(order.budget * COMMISSION_RATE);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
      <div
        className="relative w-full max-w-md h-full overflow-y-auto shadow-2xl"
        style={{ background: "#0B1730", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-5 py-4 flex items-center justify-between" style={{ background: "rgba(11,23,48,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
              style={{ background: "rgba(220,38,38,0.2)", color: "#DC2626" }}>{order.name[0]}</div>
            <div>
              <p className="font-montserrat font-bold text-white">{order.name}</p>
              <p className="text-white/40 text-xs">#{order.id} · {order.source}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-colors">
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Status */}
          <div className="rounded-xl p-4" style={{ background: "#111F40", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Статус заявки</p>
            <div className="grid grid-cols-2 gap-1.5">
              {KANBAN_COLUMNS.map(col => (
                <button key={col.id} onClick={() => onStatusChange(order.id, col.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-left ${order.status === col.id ? "text-white" : "text-white/40 hover:text-white/70"}`}
                  style={{ background: order.status === col.id ? col.color + "33" : "rgba(255,255,255,0.03)", border: `1px solid ${order.status === col.id ? col.color + "66" : "transparent"}` }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block mr-1.5" style={{ background: col.color }} />
                  {col.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-xl p-4 space-y-2.5" style={{ background: "#111F40", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Контакт</p>
            <div className="flex items-center gap-2"><Icon name="Phone" size={13} className="text-red-400" /><span className="text-white text-sm">{order.phone}</span></div>
            <div className="flex items-center gap-2"><Icon name={MESSENGER_ICON[order.messenger]} size={13} className="text-red-400" /><span className="text-white/70 text-sm capitalize">{order.messenger}</span></div>
            <div className="flex items-start gap-2"><Icon name="MapPin" size={13} className="text-red-400 mt-0.5" /><span className="text-white/70 text-sm">{order.delivery_address}</span></div>
          </div>

          {/* Financials */}
          <div className="rounded-xl p-4" style={{ background: "#111F40", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Финансы</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Бюджет", value: "₽ " + fmt(order.budget), color: "text-white" },
                { label: "Сумма сделки", value: order.deal_amount > 0 ? "₽ " + fmt(order.deal_amount) : "—", color: "text-white" },
                { label: "Комиссия агента", value: "₽ " + fmt(commission), color: "text-emerald-400" },
                { label: "Статус выплаты", value: order.commission_paid ? "Выплачено" : "Ожидает", color: order.commission_paid ? "text-emerald-400" : "text-orange-400" },
              ].map(f => (
                <div key={f.label} className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <p className="text-white/40 text-xs mb-0.5">{f.label}</p>
                  <p className={`font-bold text-sm ${f.color}`}>{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="rounded-xl p-4" style={{ background: "#111F40", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Заявка</p>
            <p className="text-white font-semibold mb-1">{order.product_name}</p>
            <p className="text-white/50 text-sm">{order.message}</p>
          </div>

          {/* Timeline */}
          <div className="rounded-xl p-4" style={{ background: "#111F40", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">История</p>
            <div className="space-y-3">
              {order.timeline.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-red-600 mt-1 shrink-0" />
                    {i < order.timeline.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: "rgba(255,255,255,0.08)" }} />}
                  </div>
                  <div className="pb-2">
                    <p className="text-white text-xs font-medium">{t.text}</p>
                    <p className="text-white/30 text-xs">{t.author} · {new Date(t.date).toLocaleDateString("ru-RU")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="rounded-xl p-4" style={{ background: "#111F40", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Добавить комментарий</p>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Комментарий менеджера..."
              className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-red-500/50 transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
            <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs w-full">Сохранить</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selected, setSelected] = useState<Order | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<OrderStatus | null>(null);

  const handleDrop = (colId: OrderStatus) => {
    if (dragging === null) return;
    setOrders(prev => prev.map(o => o.id === dragging ? { ...o, status: colId } : o));
    setDragging(null);
    setDragOver(null);
  };

  const handleStatusChange = (id: number, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  const totalExpected = orders
    .filter(o => !["done", "cancelled"].includes(o.status))
    .reduce((s, o) => s + Math.round(o.budget * COMMISSION_RATE), 0);

  return (
    <div>
      {/* Stats bar */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label: "Всего заявок", value: orders.length, color: "#3B82F6" },
          { label: "Завершено", value: orders.filter(o => o.status === "done").length, color: "#10B981" },
          { label: "Ожидаемая комиссия", value: "₽ " + fmt(totalExpected), color: "#8B5CF6" },
          { label: "Отказов", value: orders.filter(o => o.status === "cancelled").length, color: "#EF4444" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "#111F40", border: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
            <span className="text-white/50 text-xs">{s.label}:</span>
            <span className="text-white font-bold text-xs">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Kanban */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3" style={{ minWidth: "max-content" }}>
          {KANBAN_COLUMNS.map(col => {
            const colOrders = orders.filter(o => o.status === col.id);
            const colBudget = colOrders.reduce((s, o) => s + o.budget, 0);
            return (
              <div key={col.id} className="w-64 flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
                style={{ background: dragOver === col.id ? col.color + "15" : "#0F1E3D", border: `1px solid ${dragOver === col.id ? col.color + "50" : "rgba(255,255,255,0.06)"}` }}
                onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(col.id)}>
                {/* Column header */}
                <div className="px-3 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                    <span className="text-white font-semibold text-sm">{col.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {colOrders.length > 0 && <span className="text-xs text-white/30">₽{fmt(colBudget / 1000)}к</span>}
                    <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold text-white" style={{ background: col.color + "33" }}>{colOrders.length}</span>
                  </div>
                </div>
                {/* Cards */}
                <div className="flex-1 p-2 space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
                  {colOrders.map(o => (
                    <OrderCard key={o.id} order={o} onClick={() => setSelected(o)}
                      onDragStart={() => setDragging(o.id)} />
                  ))}
                  {colOrders.length === 0 && (
                    <div className="py-8 text-center text-white/20 text-xs">Пусто</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <SidePanel order={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
