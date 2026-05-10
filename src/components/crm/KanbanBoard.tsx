import { useState } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";
import type { Order } from "./types";
import { KANBAN_COLS, fmt, SOURCE_LABELS } from "./types";
import { OrderPanel } from "./OrderPanel";

type Props = { orders: Order[]; onRefresh: () => void };

export function KanbanBoard({ orders, onRefresh }: Props) {
  const [selected, setSelected] = useState<Order | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDrop = async (colId: string) => {
    if (dragging === null) return;
    const order = orders.find((o) => o.id === dragging);
    if (!order || order.kanban_status === colId) { setDragging(null); setDragOver(null); return; }
    await api.updateOrder({ ...order, kanban_status: colId });
    onRefresh();
    setDragging(null);
    setDragOver(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-montserrat text-2xl font-extrabold text-white">Заявки</h1>
          <p className="text-white/40 text-sm">Kanban · {orders.length} заявок</p>
        </div>
        <button
          onClick={() => setSelected({ id: 0, name: "", phone: "", status: "new", kanban_status: "new", commission_rate: 5, commission_paid: false, created_at: new Date().toISOString() } as Order)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-900/30">
          <Icon name="Plus" size={14} />Новая заявка
        </button>
      </div>

      {/* Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max">
          {KANBAN_COLS.map((col) => {
            const colOrders = orders.filter((o) => (o.kanban_status || "new") === col.id);
            const isDragTarget = dragOver === col.id;
            return (
              <div
                key={col.id}
                className="w-[220px] flex flex-col rounded-2xl transition-all duration-200"
                style={{ background: isDragTarget ? `${col.color}12` : "rgba(255,255,255,0.03)", border: `1px solid ${isDragTarget ? col.color + "40" : "rgba(255,255,255,0.06)"}` }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(col.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(col.id)}
              >
                {/* Col header */}
                <div className="px-3 py-3 flex items-center justify-between border-b border-white/6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                    <span className="text-xs font-semibold text-white/70">{col.label}</span>
                  </div>
                  <span className="text-xs text-white/30 font-medium bg-white/6 px-1.5 py-0.5 rounded-md">{colOrders.length}</span>
                </div>

                {/* Cards */}
                <div className="p-2 flex flex-col gap-2 flex-1 min-h-[100px]">
                  {colOrders.map((order) => (
                    <KanbanCard
                      key={order.id}
                      order={order}
                      colColor={col.color}
                      onClick={() => setSelected(order)}
                      onDragStart={() => setDragging(order.id)}
                      onDragEnd={() => { setDragging(null); setDragOver(null); }}
                    />
                  ))}
                  {colOrders.length === 0 && (
                    <div className="flex-1 flex items-center justify-center py-4">
                      <p className="text-white/15 text-xs text-center">Перетащите сюда</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side panel */}
      {selected && (
        <OrderPanel
          order={selected}
          onClose={() => setSelected(null)}
          onRefresh={() => { onRefresh(); setSelected(null); }}
        />
      )}
    </div>
  );
}

function KanbanCard({ order, colColor, onClick, onDragStart, onDragEnd }: {
  order: Order; colColor: string;
  onClick: () => void; onDragStart: () => void; onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="rounded-xl p-3 cursor-pointer group hover:scale-[1.02] active:scale-95 transition-all duration-200 select-none"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white/60 shrink-0"
          style={{ background: `${colColor}25` }}>
          {order.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">{order.name}</p>
          <p className="text-[10px] text-white/40 truncate">{order.phone}</p>
        </div>
      </div>
      {order.product_name && (
        <p className="text-[10px] text-white/50 mb-1.5 truncate">{order.product_name}</p>
      )}
      <div className="flex items-center justify-between">
        {order.deal_amount ? (
          <span className="text-[10px] font-bold text-white/80">{fmt(order.deal_amount)}</span>
        ) : <span className="text-[10px] text-white/25">Без суммы</span>}
        {order.commission_amount ? (
          <span className="text-[10px] font-semibold" style={{ color: colColor }}>{fmt(order.commission_amount)}</span>
        ) : null}
      </div>
      {order.source && (
        <div className="mt-1.5 flex items-center gap-1">
          <span className="text-[9px] text-white/25 uppercase tracking-wide">{SOURCE_LABELS[order.source] || order.source}</span>
        </div>
      )}
    </div>
  );
}
