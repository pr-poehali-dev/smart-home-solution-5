import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import type { Section } from "./types";

const NAV = [
  { id: "dashboard", icon: "LayoutDashboard", label: "Дашборд" },
  { id: "orders", icon: "ClipboardList", label: "Заявки" },
  { id: "catalog", icon: "Package", label: "Каталог" },
  { id: "finance", icon: "DollarSign", label: "Финансы" },
  { id: "analytics", icon: "BarChart2", label: "Аналитика" },
  { id: "settings", icon: "Settings", label: "Настройки" },
] as const;

type Props = {
  active: Section;
  onSelect: (s: Section) => void;
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
  newCount?: number;
};

export function CrmSidebar({ active, onSelect, collapsed, onToggle, onLogout, newCount }: Props) {
  return (
    <aside
      className="flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 z-20"
      style={{
        width: collapsed ? 64 : 220,
        background: "rgba(8,15,32,0.95)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/6">
        <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
          <Icon name="Building2" size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-montserrat font-extrabold text-white text-sm leading-tight">
            МодульСтрой<br /><span className="text-white/40 font-normal text-xs">CRM</span>
          </span>
        )}
        <button
          onClick={onToggle}
          className="ml-auto text-white/30 hover:text-white transition-colors"
        >
          <Icon name={collapsed ? "PanelLeftOpen" : "PanelLeftClose"} size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id as Section)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group relative ${
                isActive
                  ? "bg-red-600/15 text-red-400"
                  : "text-white/40 hover:text-white hover:bg-white/6"
              }`}
            >
              <Icon name={item.icon} size={18} className={isActive ? "text-red-400" : "text-white/40 group-hover:text-white/80"} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {item.id === "orders" && newCount && newCount > 0 ? (
                <span className={`${collapsed ? "absolute top-1 right-1" : "ml-auto"} min-w-[18px] h-[18px] rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center px-1`}>
                  {newCount}
                </span>
              ) : null}
              {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-red-500 rounded-full" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 space-y-1 border-t border-white/6 pt-3">
        <Link to="/" target="_blank">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-white hover:bg-white/6 transition-all duration-200">
            <Icon name="ExternalLink" size={16} />
            {!collapsed && <span className="text-xs">Открыть сайт</span>}
          </button>
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200"
        >
          <Icon name="LogOut" size={16} />
          {!collapsed && <span className="text-xs">Выйти</span>}
        </button>
      </div>
    </aside>
  );
}
