import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import Icon from "@/components/ui/icon";
import type { CrmStats } from "./types";
import { fmt, fmtNum } from "./types";

type Props = { stats: CrmStats | null };

const COLORS = ["#ef4444", "#3b82f6", "#f59e0b", "#22c55e", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"];

type TipItem = { name: string; value: number; color: string };
const ChartTip = ({ active, payload, label }: { active?: boolean; payload?: TipItem[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: "rgba(10,18,40,0.98)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p) => <p key={p.name} className="font-semibold" style={{ color: p.color }}>{p.name}: {fmtNum(p.value)}</p>)}
    </div>
  );
};

const FUNNEL_ORDER = ["new","contacted","sent_calc","waiting","production","delivery","done","rejected"];
const FUNNEL_LABELS: Record<string, string> = {
  new: "Новая", contacted: "Связались", sent_calc: "Расчёт", waiting: "Ожидание",
  production: "Производство", delivery: "Доставка", done: "Завершено", rejected: "Отказ"
};

export function Analytics({ stats }: Props) {
  if (!stats) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
    </div>
  );

  const funnelData = FUNNEL_ORDER
    .filter((k) => stats.funnel[k])
    .map((k) => ({ name: FUNNEL_LABELS[k], value: stats.funnel[k], key: k }));

  const maxFunnel = Math.max(...funnelData.map((d) => d.value), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-montserrat text-2xl font-extrabold text-white">Аналитика</h1>
        <p className="text-white/40 text-sm">Конверсия, эффективность, источники</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Конверсия", value: `${stats.conversion}%`, icon: "Target", color: "#22c55e" },
          { label: "Всего заявок", value: fmtNum(stats.total_orders), icon: "ClipboardList", color: "#3b82f6" },
          { label: "Средний чек", value: fmt(stats.avg_deal), icon: "Receipt", color: "#a855f7" },
          { label: "Завершено", value: fmtNum(stats.done_orders), icon: "CheckCircle", color: "#ef4444" },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: `${k.color}18` }}>
              <Icon name={k.icon} size={16} style={{ color: k.color }} />
            </div>
            <p className="font-montserrat text-xl font-black text-white">{k.value}</p>
            <p className="text-white/40 text-xs mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="font-montserrat font-bold text-white text-sm mb-4">Воронка продаж</h3>
        {funnelData.length > 0 ? (
          <div className="space-y-2">
            {funnelData.map((item, i) => (
              <div key={item.key} className="flex items-center gap-3">
                <span className="text-xs text-white/50 w-24 shrink-0">{item.name}</span>
                <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-lg flex items-center px-3 transition-all duration-700"
                    style={{
                      width: `${(item.value / maxFunnel) * 100}%`,
                      background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}cc, ${COLORS[i % COLORS.length]}80)`,
                      minWidth: 40
                    }}
                  >
                    <span className="text-xs font-bold text-white">{item.value}</span>
                  </div>
                </div>
                {i > 0 && funnelData[i-1].value > 0 && (
                  <span className="text-xs text-white/30 w-10 shrink-0">
                    {Math.round(item.value / funnelData[0].value * 100)}%
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/20 text-sm text-center py-8">Нет данных</p>
        )}
      </div>

      {/* Charts grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* By source */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="font-montserrat font-bold text-white text-sm mb-4">Источники заявок</h3>
          {stats.by_source.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={stats.by_source} dataKey="count" nameKey="source" cx="50%" cy="50%" innerRadius={40} outerRadius={65}>
                    {stats.by_source.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [v, "Заявок"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {stats.by_source.map((s, i) => (
                  <div key={s.source} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-white/50 truncate">{s.source}</span>
                    <span className="text-white/30 ml-auto">{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-white/20 text-sm text-center py-12">Нет данных</p>}
        </div>

        {/* By region */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="font-montserrat font-bold text-white text-sm mb-4">Топ регионов</h3>
          {stats.by_region.length > 0 ? (
            <div className="space-y-2">
              {stats.by_region.slice(0, 6).map((r, i) => (
                <div key={r.region} className="flex items-center gap-3">
                  <span className="text-xs text-white/30 w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-white/70 truncate">{r.region}</span>
                      <span className="text-xs text-white/40 shrink-0 ml-2">{r.count} заявок</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full" style={{
                        width: `${(r.count / stats.by_region[0].count) * 100}%`,
                        background: COLORS[i % COLORS.length]
                      }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white/60 w-16 text-right shrink-0">{fmt(r.revenue)}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-white/20 text-sm text-center py-12">Нет данных</p>}
        </div>

        {/* Заявки по дням */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="font-montserrat font-bold text-white text-sm mb-4">Заявки за 30 дней</h3>
          {stats.by_day.length > 0 ? (
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={stats.by_day}>
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                <Tooltip content={<ChartTip />} />
                <Line type="monotone" dataKey="orders" name="Заявки" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-white/20 text-sm text-center py-8">Нет данных</p>}
        </div>
      </div>
    </div>
  );
}
