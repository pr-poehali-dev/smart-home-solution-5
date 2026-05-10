import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Icon from "@/components/ui/icon";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const NAV = [
  { to: "/", label: "Главная" },
  { to: "/properties", label: "Каталог" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md" style={{ borderBottom: "1px solid #E5E5E3" }}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E53935] flex items-center justify-center">
            <Icon name="Building2" size={15} className="text-white" />
          </div>
          <span className="font-bold text-[#111] text-[17px] tracking-tight">МодульСтрой</span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {NAV.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${loc.pathname === l.to ? "text-[#111] bg-[#F2F2F0]" : "text-[#6B7280] hover:text-[#111] hover:bg-[#F7F7F5]"}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="tel:+78000000000" className="hidden md:flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111] transition-colors">
            <Icon name="Phone" size={14} className="text-[#E53935]" />
            +7 (800) 000-00-00
          </a>
          <a href="#calc" className="hidden md:flex items-center h-9 px-4 rounded-[10px] bg-[#E53935] hover:bg-[#C62828] text-white text-sm font-semibold transition-all duration-150 hover:shadow-[0_2px_8px_rgba(229,57,53,0.3)]">
            Получить расчёт
          </a>
          <button className="md:hidden p-2 text-[#6B7280]" onClick={() => setOpen(!open)}>
            <Icon name={open ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-[#E5E5E3] px-4 pb-4 pt-2 space-y-1">
          {NAV.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:text-[#111] hover:bg-[#F7F7F5] transition-colors">
              {l.label}
            </Link>
          ))}
          <a href="#calc" onClick={() => setOpen(false)}
            className="block w-full text-center mt-2 h-10 leading-10 rounded-[10px] bg-[#E53935] text-white text-sm font-semibold">
            Получить расчёт
          </a>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container py-14">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E53935] flex items-center justify-center">
                <Icon name="Building2" size={15} className="text-white" />
              </div>
              <span className="font-bold text-white text-[17px]">МодульСтрой</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Производство модульных строений на металлокаркасе. Собственный завод. Доставка по всей России.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: "Send", href: "https://t.me/", label: "TG" },
                { icon: "MessageCircle", href: "https://wa.me/", label: "WA" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white transition-all">
                  <Icon name={s.icon} size={15} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Каталог</h4>
            <div className="space-y-2.5">
              {["Бытовки", "Дачные домики", "Бани", "Хостблоки", "Хозблоки"].map(t => (
                <Link key={t} to="/properties" className="block text-sm text-white/50 hover:text-white transition-colors">{t}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Контакты</h4>
            <div className="space-y-3">
              <a href="tel:+78000000000" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                <Icon name="Phone" size={13} className="text-[#E53935]" />+7 (800) 000-00-00
              </a>
              <a href="mailto:info@modulstroy.ru" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                <Icon name="Mail" size={13} className="text-[#E53935]" />info@modulstroy.ru
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/25 text-xs">© 2024 МодульСтрой. Все права защищены.</p>
          <p className="text-white/20 text-xs">7 дней · Гарантия 1 год · Доставка по РФ</p>
        </div>
      </div>
    </footer>
  );
}

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col" style={{ background: "#F7F7F5" }}>
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/x9k2admin" element={<Admin />} />
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/properties/:id" element={<PropertyDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
