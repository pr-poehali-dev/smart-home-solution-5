import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";
import { CrmSidebar } from "@/components/crm/Sidebar";
import { Dashboard } from "@/components/crm/Dashboard";
import { KanbanBoard } from "@/components/crm/KanbanBoard";
import { Finance } from "@/components/crm/Finance";
import { Analytics } from "@/components/crm/Analytics";
import { CatalogCrm } from "@/components/crm/CatalogCrm";
import type { Section } from "@/components/crm/types";
import type { Order, Product, CrmStats } from "@/components/crm/types";

/* ── Login ── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await api.login(password);
    setLoading(false);
    if (res.token) {
      localStorage.setItem("admin_token", res.token);
      onLogin();
    } else {
      setError("Неверный пароль");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#080f20" }}>
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(220,38,38,0.08) 0%, transparent 70%)" }} />

      <div className="relative w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-900/40">
            <Icon name="Building2" size={26} className="text-white" />
          </div>
          <h1 className="font-montserrat text-2xl font-extrabold text-white">МодульСтрой CRM</h1>
          <p className="text-white/40 text-sm mt-1">Система управления продажами</p>
        </div>

        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Пароль</Label>
              <div className="relative">
                <Icon name="Lock" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <Input
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-red-500/60 rounded-xl h-11"
                />
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm px-1">
                <Icon name="AlertCircle" size={14} />
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-900/30 transition-all duration-200 hover:scale-[1.02]"
            >
              {loading ? "Входим..." : "Войти в CRM"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Settings ── */
function Settings({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-montserrat text-2xl font-extrabold text-white">Настройки</h1>
        <p className="text-white/40 text-sm">Конфигурация системы</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { icon: "Percent", title: "Ставка комиссии", desc: "По умолчанию 5% — настраивается в каждой сделке", value: "5%" },
          { icon: "Bell", title: "Уведомления", desc: "Telegram-уведомления при новой заявке", value: "Настроить" },
          { icon: "Building2", title: "Компания", desc: "МодульСтрой — производство модульных строений", value: "Изменить" },
          { icon: "Shield", title: "Безопасность", desc: "Изменить пароль от CRM", value: "Сменить" },
        ].map((s) => (
          <div key={s.title} className="rounded-2xl p-5 flex items-start gap-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-9 h-9 rounded-xl bg-red-600/15 flex items-center justify-center shrink-0">
              <Icon name={s.icon} size={18} className="text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm">{s.title}</h3>
              <p className="text-white/40 text-xs mt-0.5">{s.desc}</p>
            </div>
            <span className="text-xs text-white/30 shrink-0 pt-0.5">{s.value}</span>
          </div>
        ))}
      </div>
      <div className="pt-2">
        <Button onClick={onLogout} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl">
          <Icon name="LogOut" size={14} className="mr-2" />
          Выйти из CRM
        </Button>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [section, setSection] = useState<Section>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState<CrmStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const loadData = useCallback(async () => {
    const [s, o, p] = await Promise.all([api.getCrmStats(), api.getOrders(), api.getProducts()]);
    if (!s.error) setStats(s);
    if (Array.isArray(o)) setOrders(o);
    if (Array.isArray(p)) setProducts(p);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { setChecking(false); return; }
    api.checkAuth().then((res) => {
      if (res.ok) { setAuthed(true); loadData(); }
      setChecking(false);
    });
  }, [loadData]);

  const handleLogin = () => { setAuthed(true); loadData(); };
  const handleLogout = () => { localStorage.removeItem("admin_token"); setAuthed(false); };

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#080f20" }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-red-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-white/40 text-sm">Загружаем CRM...</p>
      </div>
    </div>
  );

  if (!authed) return <LoginScreen onLogin={handleLogin} />;

  const newCount = orders.filter((o) => o.kanban_status === "new").length;

  return (
    <div className="flex min-h-screen" style={{ background: "#080f20", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <CrmSidebar
        active={section}
        onSelect={setSection}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
        newCount={newCount}
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 h-14 border-b"
          style={{ background: "rgba(8,15,32,0.9)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Icon name="Building2" size={13} className="text-red-400" />
            <span>МодульСтрой</span>
            <Icon name="ChevronRight" size={11} />
            <span className="text-white capitalize">{section === "dashboard" ? "Дашборд" : section === "orders" ? "Заявки" : section === "catalog" ? "Каталог" : section === "finance" ? "Финансы" : section === "analytics" ? "Аналитика" : "Настройки"}</span>
          </div>
          <div className="flex items-center gap-3">
            {newCount > 0 && (
              <button onClick={() => setSection("orders")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {newCount} новых
              </button>
            )}
            <button onClick={loadData} className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all">
              <Icon name="RefreshCw" size={14} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {section === "dashboard" && <Dashboard stats={stats} orders={orders} onSection={(s) => setSection(s as Section)} />}
          {section === "orders" && <KanbanBoard orders={orders} onRefresh={loadData} />}
          {section === "catalog" && <CatalogCrm products={products} onRefresh={loadData} />}
          {section === "finance" && <Finance stats={stats} orders={orders} onRefresh={loadData} />}
          {section === "analytics" && <Analytics stats={stats} />}
          {section === "settings" && <Settings onLogout={handleLogout} />}
        </div>
      </div>
    </div>
  );
}
