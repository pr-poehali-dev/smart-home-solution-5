import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import Icon from "@/components/ui/icon";
import type { CrmStats, Order } from "./types";
import { fmt, fmtNum } from "./types";
import { api } from "@/lib/api";

type Props = { stats: CrmStats | null; orders: Order[]; onRefresh: () => void };

type TooltipPayloadItem = { name: string; value: number; color: string };
const ChartTip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: "rgba(10,18,40,0.98)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p) => <p key={p.name} className="font-semibold" style={{ color: p.color }}>{p.name}: {fmtNum(p.value)}</p>)}
    </div>
  );
};

export function Finance({ stats, orders, onRefresh }: Props) {
  const [commRate, setCommRate] = useState(5);
  const doneOrders = orders.filter((o) => o.kanban_status === "done");
  const monthData = stats?.by_month.slice(0, 6).reverse() || [];

  const handleTogglePaid = async (order: Order) => {
    await api.updateOrder({ ...order, commission_paid: !order.commission_paid });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-montserrat text-2xl font-extrabold text-white">Финансы</h1>
        <p className="text-white/40 text-sm">Выручка, комиссии, расчёты</p>
      </div>

      {/* Top KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Общая выручка", value: stats?.total_revenue || 0, icon: "TrendingUp", color: "#22c55e" },
          { label: "Комиссия агента (5%)", value: stats?.total_commission || 0, icon: "Percent", color: "#ef4444" },
          { label: "Выплачено", value: stats?.paid_commission || 0, icon: "BadgeCheck", color: "#10b981" },
          { label: "Ожидает выплаты", value: stats?.pending_commission || 0, icon: "Clock", color: "#f59e0b" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: `${item.color}18` }}>
              <Icon name={item.icon} size={16} style={{ color: item.color }} />
            </div>
            <p className="font-montserrat text-xl font-black text-white">{fmt(item.value)}</p>
            <p className="text-white/40 text-xs mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Commission calculator */}
      <div className="rounded-2xl p-5" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-red-600/20 flex items-center justify-center">
            <Icon name="Calculator" size={18} className="text-red-400" />
          </div>
          <div>
            <h3 className="font-montserrat font-bold text-white text-sm">Калькулятор комиссии</h3>
            <p className="text-white/40 text-xs">Настройте ставку агента</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <input type="range" min={1} max={20} step={0.5} value={commRate} onChange={(e) => setCommRate(parseFloat(e.target.value))}
              className="w-32 accent-red-600 cursor-pointer" />
            <span className="text-white font-bold text-lg w-12">{commRate}%</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-montserrat text-2xl font-black text-white">{fmt(stats?.total_revenue || 0)}</p>
            <p className="text-white/40 text-xs">Выручка</p>
          </div>
          <div>
            <p className="font-montserrat text-2xl font-black text-red-400">{fmt(Math.round((stats?.total_revenue || 0) * commRate / 100))}</p>
            <p className="text-white/40 text-xs">Комиссия при {commRate}%</p>
          </div>
          <div>
            <p className="font-montserrat text-2xl font-black text-emerald-400">{fmt(Math.round((stats?.expected_commission || 0) * commRate / 100))}</p>
            <p className="text-white/40 text-xs">Ожидается (pipeline)</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="font-montserrat font-bold text-white text-sm mb-4">Динамика по месяцам</h3>
        {monthData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthData}>
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} width={55}
                tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}м` : `${(v/1000).toFixed(0)}к`} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="revenue" name="Выручка" fill="#ef4444" radius={[4,4,0,0]} />
              <Bar dataKey="commission" name="Комиссия" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-40">
            <p className="text-white/20 text-sm">Данные появятся после первых сделок</p>
          </div>
        )}
      </div>

      {/* Completed deals list */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="px-5 py-4 border-b border-white/6">
          <h3 className="font-montserrat font-bold text-white text-sm">Закрытые сделки</h3>
          <p className="text-white/30 text-xs">{doneOrders.length} завершённых — контролируйте выплату комиссии</p>
        </div>
        {doneOrders.length === 0 ? (
          <div className="py-12 text-center">
            <Icon name="TrendingUp" size={32} className="text-white/15 mx-auto mb-2" />
            <p className="text-white/25 text-sm">Закрытых сделок пока нет</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {doneOrders.map((o) => (
              <div key={o.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/3 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-xs font-bold text-white/50 shrink-0">
                  {o.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{o.name}</p>
                  <p className="text-xs text-white/40 truncate">{o.product_name || "—"} · {o.region || "Регион не указан"}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-white">{fmt(o.deal_amount || 0)}</p>
                  <p className="text-xs text-red-400">+{fmt(o.commission_amount || 0)}</p>
                </div>
                <button
                  onClick={() => handleTogglePaid(o)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    o.commission_paid
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                      : "bg-white/5 text-white/40 border border-white/10 hover:border-emerald-500/30 hover:text-emerald-400"
                  }`}
                >
                  <Icon name={o.commission_paid ? "CheckCircle" : "Circle"} size={12} />
                  {o.commission_paid ? "Выплачено" : "Выплатить"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
