import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Icon from "@/components/ui/icon";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const NAV_LINKS = [
  { to: "/", label: "Главная" },
  { to: "/properties", label: "Каталог" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: 'rgba(11,23,48,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
            <Icon name="Building2" size={16} className="text-white" />
          </div>
          <span className="font-montserrat font-extrabold text-white text-lg tracking-tight">МодульСтрой</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === l.to ? 'text-white bg-white/8' : 'text-white/60 hover:text-white hover:bg-white/6'}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="tel:+78000000000" className="hidden md:flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mr-2">
            <Icon name="Phone" size={14} className="text-red-400" />
            +7 (800) 000-00-00
          </a>
          <Link to="/properties">
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm hidden md:flex shadow-lg shadow-red-900/30 transition-all duration-200 hover:scale-[1.02]">
              Получить расчёт
            </Button>
          </Link>
          <button className="md:hidden p-2 text-white/60 hover:text-white transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-1" style={{ background: 'rgba(11,23,48,0.98)' }}>
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/6 transition-colors text-sm font-medium">
              {l.label}
            </Link>
          ))}
          <Link to="/properties" onClick={() => setMenuOpen(false)}>
            <Button className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold">Получить расчёт</Button>
          </Link>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#060e1e', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <Icon name="Building2" size={16} className="text-white" />
              </div>
              <span className="font-montserrat font-extrabold text-white text-lg">МодульСтрой</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">Производство модульных строений на металлокаркасе. Собственный завод, доставка по всей России.</p>
          </div>
          <div>
            <h4 className="font-montserrat font-bold text-white text-sm uppercase tracking-wider mb-4">Каталог</h4>
            <div className="space-y-2">
              {["Бытовки", "Дачные домики", "Хостблоки", "Блок-контейнеры"].map(t => (
                <Link key={t} to="/properties" className="block text-sm text-white/40 hover:text-white transition-colors">{t}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-montserrat font-bold text-white text-sm uppercase tracking-wider mb-4">Контакты</h4>
            <div className="space-y-3">
              <a href="tel:+78000000000" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                <Icon name="Phone" size={14} className="text-red-400" />+7 (800) 000-00-00
              </a>
              <a href="mailto:info@modulstroy.ru" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                <Icon name="Mail" size={14} className="text-red-400" />info@modulstroy.ru
              </a>
              <a href="https://t.me/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                <Icon name="Send" size={14} className="text-red-400" />Telegram
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/6 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/25 text-xs">© 2024 МодульСтрой. Все права защищены.</p>
          <p className="text-white/20 text-xs">Изготовление от 7 дней · Гарантия 1 год · Доставка по РФ</p>
        </div>
      </div>
    </footer>
  );
}

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col" style={{ background: '#0B1730' }}>
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
