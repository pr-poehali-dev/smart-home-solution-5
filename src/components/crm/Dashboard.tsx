import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Icon from "@/components/ui/icon";
import type { CrmStats, Order } from "./types";
import { fmt, fmtNum } from "./types";

type Props = { stats: CrmStats | null; orders: Order[]; onSection: (s: string) => void };

const KPI = [
  { key: "new_orders", label: "Новые заявки", icon: "Inbox", color: "#3b82f6", suffix: "" },
  { key: "in_progress", label: "В работе", icon: "Zap", color: "#f59e0b", suffix: "" },
  { key: "done_orders", label: "Завершено", icon: "CheckCircle", color: "#22c55e", suffix: "" },
  { key: "total_revenue", label: "Выручка", icon: "TrendingUp", color: "#a855f7", fmt: true },
  { key: "total_commission", label: "Комиссия агента", icon: "Percent", color: "#ef4444", fmt: true },
  { key: "pending_commission", label: "Ожидает выплаты", icon: "Clock", color: "#f97316", fmt: true },
  { key: "paid_commission", label: "Выплачено", icon: "BadgeCheck", color: "#10b981", fmt: true },
  { key: "avg_deal", label: "Средний чек", icon: "Receipt", color: "#06b6d4", fmt: true },
  { key: "conversion", label: "Конверсия", icon: "Target", color: "#8b5cf6", suffix: "%" },
];

const PIE_COLORS = ["#ef4444", "#3b82f6", "#f59e0b", "#22c55e", "#8b5cf6", "#06b6d4"];

function KpiCard({ label, value, icon, color, isFmt, suffix }: {
  label: string; value: number; icon: string; color: string; isFmt?: boolean; suffix?: string;
}) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3 group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 0% 0%, ${color}12 0%, transparent 70%)` }} />
      <div className="flex items-start justify-between z-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon name={icon} size={18} style={{ color }} />
        </div>
      </div>
      <div className="z-10">
        <p className="font-montserrat text-2xl font-black text-white">
          {isFmt ? fmt(value) : fmtNum(value)}{suffix || ""}
        </p>
        <p className="text-white/40 text-xs mt-0.5">{label}</p>
      </div>
    </div>
  );
}

type TooltipPayloadItem = { name: string; value: number; color: string };
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: "rgba(15,25,50,0.97)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-semibold" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export function Dashboard({ stats, orders, onSection }: Props) {
  if (!stats) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-red-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-white/40 text-sm">Загружаем данные...</p>
      </div>
    </div>
  );

  const sourceData = stats.by_source.slice(0, 5);
  const revenueData = stats.by_month.slice(0, 6).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-montserrat text-2xl font-extrabold text-white">Дашборд</h1>
          <p className="text-white/40 text-sm mt-0.5">Обзор продаж и комиссий</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSection("orders")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-900/30">
            <Icon name="Plus" size={14} />Новая заявка
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {KPI.map((k) => (
          <KpiCard
            key={k.key}
            label={k.label}
            value={(stats as Record<string, number>)[k.key] ?? 0}
            icon={k.icon}
            color={k.color}
            isFmt={k.fmt}
            suffix={k.suffix}
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-montserrat font-bold text-white text-sm">Выручка и комиссия</h3>
              <p className="text-white/30 text-xs">По месяцам</p>
            </div>
          </div>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="comm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} width={60}
                  tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}м` : v >= 1000 ? `${(v/1000).toFixed(0)}к` : String(v)} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Выручка" stroke="#ef4444" fill="url(#rev)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="commission" name="Комиссия" stroke="#3b82f6" fill="url(#comm)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-44">
              <p className="text-white/20 text-sm">Данных пока нет — добавьте заявки</p>
            </div>
          )}
        </div>

        {/* Source pie */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="font-montserrat font-bold text-white text-sm mb-1">Источники заявок</h3>
          <p className="text-white/30 text-xs mb-4">Откуда клиенты</p>
          {sourceData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={sourceData} dataKey="count" cx="50%" cy="50%" innerRadius={35} outerRadius={55}>
                    {sourceData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {sourceData.map((s, i) => (
                  <div key={s.source} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-white/60">{s.source}</span>
                    </div>
                    <span className="text-white/40">{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-44">
              <p className="text-white/20 text-sm text-center">Нет данных</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Commission block */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 flex items-center justify-center">
              <Icon name="Percent" size={16} className="text-red-400" />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-white text-sm">Агентская комиссия (5%)</h3>
              <p className="text-white/30 text-xs">Ваш доход с продаж</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Всего заработано", value: stats.total_commission, color: "#ef4444" },
              { label: "Выплачено", value: stats.paid_commission, color: "#22c55e" },
              { label: "Ожидает выплаты", value: stats.pending_commission, color: "#f59e0b" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-montserrat font-black text-xl" style={{ color: item.color }}>{fmt(item.value)}</p>
                <p className="text-white/40 text-xs mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Выплачено</span>
              <span>{stats.total_commission > 0 ? Math.round(stats.paid_commission / stats.total_commission * 100) : 0}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-700"
                style={{ width: `${stats.total_commission > 0 ? Math.round(stats.paid_commission / stats.total_commission * 100) : 0}%` }} />
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-montserrat font-bold text-white text-sm">Последние заявки</h3>
            <button onClick={() => onSection("orders")} className="text-xs text-red-400 hover:text-red-300 transition-colors">
              Все →
            </button>
          </div>
          <div className="space-y-2">
            {stats.recent.length === 0 && (
              <div className="text-center py-8">
                <Icon name="Inbox" size={28} className="text-white/15 mx-auto mb-2" />
                <p className="text-white/25 text-sm">Заявок пока нет</p>
              </div>
            )}
            {stats.recent.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center shrink-0 text-xs font-bold text-white/50">
                    {o.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{o.name}</p>
                    <p className="text-xs text-white/30 truncate">{o.product_name || "Не указано"}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-sm font-bold text-white">{o.deal_amount ? fmt(o.deal_amount) : "—"}</p>
                  <p className="text-xs text-red-400">{o.commission_amount ? fmt(o.commission_amount) : "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}