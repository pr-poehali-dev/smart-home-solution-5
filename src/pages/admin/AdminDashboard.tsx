import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Icon from "@/components/ui/icon";
import { MOCK_ORDERS, MOCK_PRODUCTS, REVENUE_DATA, SOURCE_DATA, calcStats, COMMISSION_RATE } from "./data";

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);
const fmtM = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)} млн`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)} тыс`;
  return String(n);
};

const KPI_CARDS = (s: ReturnType<typeof calcStats>, orders: typeof MOCK_ORDERS) => [
  { label: "Новые заявки", value: s.newCount, icon: "Bell", color: "#3B82F6", glow: "rgba(59,130,246,0.15)", change: "+3 сегодня", up: true },
  { label: "В работе", value: s.activeCount, icon: "Activity", color: "#F59E0B", glow: "rgba(245,158,11,0.15)", change: "активных", up: true },
  { label: "Завершено", value: s.doneCount, icon: "CheckCircle", color: "#10B981", glow: "rgba(16,185,129,0.15)", change: `+${Math.round(s.conversion)}% конверсия`, up: true },
  { label: "Выручка", value: "₽ " + fmtM(s.totalRevenue), icon: "TrendingUp", color: "#DC2626", glow: "rgba(220,38,38,0.15)", change: "+18% к прошлому месяцу", up: true },
  { label: "Комиссия агента", value: "₽ " + fmtM(s.totalCommission), icon: "Wallet", color: "#8B5CF6", glow: "rgba(139,92,246,0.15)", change: `${(COMMISSION_RATE * 100).toFixed(0)}% от выручки`, up: true },
  { label: "Ожидаемая комиссия", value: "₽ " + fmtM(s.expectedCommission), icon: "Clock", color: "#F97316", glow: "rgba(249,115,22,0.15)", change: "по активным сделкам", up: null },
  { label: "Выплачено", value: "₽ " + fmtM(s.paidCommission), icon: "BadgeCheck", color: "#10B981", glow: "rgba(16,185,129,0.15)", change: "выплачено агенту", up: true },
  { label: "К выплате", value: "₽ " + fmtM(s.pendingCommission), icon: "AlertCircle", color: "#EF4444", glow: "rgba(239,68,68,0.15)", change: "ожидает выплаты", up: false },
  { label: "Средний чек", value: "₽ " + fmtM(s.avgDeal), icon: "BarChart2", color: "#06B6D4", glow: "rgba(6,182,212,0.15)", change: "+12% к апрелю", up: true },
  { label: "Конверсия", value: s.conversion + "%", icon: "Target", color: "#EC4899", glow: "rgba(236,72,153,0.15)", change: "заявок → сделок", up: true },
];

const QUICK_ACTIONS = [
  { label: "Создать заявку", icon: "Plus", color: "#DC2626" },
  { label: "Добавить товар", icon: "Package", color: "#3B82F6" },
  { label: "Загрузить фото", icon: "Upload", color: "#8B5CF6" },
  { label: "Создать расчёт", icon: "Calculator", color: "#F59E0B" },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl px-4 py-3 text-sm shadow-xl" style={{ background: "#0F1E3D", border: "1px solid rgba(255,255,255,0.08)" }}>
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-bold text-white">₽ {fmt(p.value)}</p>
      ))}
    </div>
  );
};

export default function AdminDashboard({ onNavigate }: { onNavigate: (section: string) => void }) {
  const stats = calcStats(MOCK_ORDERS);
  const kpis = KPI_CARDS(stats, MOCK_ORDERS);
  const recent = MOCK_ORDERS.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-default group relative overflow-hidden"
            style={{ background: "#111F40", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
              style={{ background: k.glow }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: k.glow }}>
                  <Icon name={k.icon} size={15} style={{ color: k.color }} />
                </div>
                {k.up !== null && (
                  <span className={`text-xs font-medium ${k.up ? "text-emerald-400" : "text-red-400"}`}>
                    {k.up ? "↑" : "↓"}
                  </span>
                )}
              </div>
              <p className="font-montserrat text-xl font-black text-white leading-none mb-1">{k.value}</p>
              <p className="text-white/40 text-xs leading-tight">{k.label}</p>
              <p className="text-white/25 text-xs mt-0.5">{k.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "#111F40", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-montserrat font-bold text-white">Выручка и комиссии</p>
              <p className="text-white/40 text-xs mt-0.5">Последние 6 месяцев</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/50">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-600 inline-block" />Выручка</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block" />Комиссия</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradComm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#DC2626" strokeWidth={2} fill="url(#gradRev)" />
              <Area type="monotone" dataKey="commission" stroke="#8B5CF6" strokeWidth={2} fill="url(#gradComm)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sources Pie */}
        <div className="rounded-2xl p-5" style={{ background: "#111F40", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="font-montserrat font-bold text-white mb-1">Источники заявок</p>
          <p className="text-white/40 text-xs mb-4">По каналам привлечения</p>
          <div className="flex justify-center mb-4">
            <PieChart width={140} height={140}>
              <Pie data={SOURCE_DATA} cx={65} cy={65} innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                {SOURCE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2">
            {SOURCE_DATA.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-white/60 text-xs">{s.name}</span>
                </div>
                <span className="font-bold text-white text-xs">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "#111F40", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="font-montserrat font-bold text-white">Последние заявки</p>
            <button onClick={() => onNavigate("orders")} className="text-xs text-red-400 hover:text-red-300 transition-colors">Все заявки →</button>
          </div>
          <div className="space-y-2">
            {recent.map(o => (
              <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/4 transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-sm"
                  style={{ background: "rgba(220,38,38,0.2)", color: "#DC2626" }}>
                  {o.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{o.name}</p>
                  <p className="text-white/40 text-xs truncate">{o.product_name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white text-sm font-bold">₽ {fmt(o.budget)}</p>
                  <p className="text-emerald-400 text-xs">+₽ {fmt(Math.round(o.budget * COMMISSION_RATE))}</p>
                </div>
                <div className="w-2 h-2 rounded-full shrink-0" style={{
                  background: o.status === "done" ? "#10B981" : o.status === "cancelled" ? "#EF4444" : o.status === "new" ? "#3B82F6" : "#F59E0B"
                }} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions + top products */}
        <div className="space-y-4">
          <div className="rounded-2xl p-5" style={{ background: "#111F40", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="font-montserrat font-bold text-white mb-3 text-sm">Быстрые действия</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map(a => (
                <button key={a.label} onClick={() => onNavigate(a.label === "Создать заявку" || a.label === "Создать расчёт" ? "orders" : a.label === "Добавить товар" || a.label === "Загрузить фото" ? "catalog" : "orders")}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:scale-[1.03] group"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: a.color + "22" }}>
                    <Icon name={a.icon} size={16} style={{ color: a.color }} />
                  </div>
                  <span className="text-white/60 text-xs text-center leading-tight group-hover:text-white transition-colors">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "#111F40", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="font-montserrat font-bold text-white mb-3 text-sm">Топ товары</p>
            <div className="space-y-2.5">
              {MOCK_PRODUCTS.slice(0, 4).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-white/25 font-bold text-xs w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{p.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="h-1 rounded-full bg-red-600 transition-all" style={{ width: `${Math.round(p.sales / 25 * 100)}%`, maxWidth: "100%" }} />
                    </div>
                  </div>
                  <span className="text-white/50 text-xs shrink-0">{p.sales} прод.</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
