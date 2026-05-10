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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-g200">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#E53935] flex items-center justify-center">
            <Icon name="Building2" size={15} className="text-white" />
          </div>
          <span className="font-bold text-ink text-[17px] tracking-tight">МодульСтрой</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${loc.pathname === l.to ? "bg-g100 text-ink" : "text-g600 hover:text-ink hover:bg-g50"}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+78000000000" className="flex items-center gap-1.5 text-sm text-g600 hover:text-ink transition-colors">
            <Icon name="Phone" size={13} className="text-[#E53935]" />
            +7 (800) 000-00-00
          </a>
          <a href="#calc"
            className="h-9 px-4 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white text-sm font-semibold transition-colors flex items-center shadow-red">
            Получить расчёт
          </a>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden p-2 text-g600" onClick={() => setOpen(!open)}>
          <Icon name={open ? "X" : "Menu"} size={20} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-g200 px-4 pb-4 pt-2 space-y-1">
          {NAV.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="flex px-3 py-2.5 rounded-lg text-sm font-medium text-g600 hover:text-ink hover:bg-g50 transition-colors">
              {l.label}
            </Link>
          ))}
          <a href="tel:+78000000000" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-g600 hover:text-ink hover:bg-g50 transition-colors">
            <Icon name="Phone" size={13} className="text-[#E53935]" />
            +7 (800) 000-00-00
          </a>
          <a href="#calc" onClick={() => setOpen(false)}
            className="block w-full text-center mt-2 h-11 leading-[44px] rounded-xl bg-[#E53935] text-white text-sm font-semibold">
            Получить расчёт
          </a>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-ink border-t border-white/8">
      <div className="container py-14">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
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
            <div className="flex gap-2.5 mt-5">
              {[{icon:"Send",href:"https://t.me/"},{icon:"MessageCircle",href:"https://wa.me/"}].map(s => (
                <a key={s.icon} href={s.href} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                  <Icon name={s.icon} size={15} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-4">Каталог</h4>
            <div className="space-y-2.5">
              {["Бытовки","Дачные домики","Бани","Хостблоки","Хозблоки"].map(t => (
                <Link key={t} to="/properties" className="block text-sm text-white/50 hover:text-white transition-colors">{t}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-4">Контакты</h4>
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
          <p className="text-white/20 text-xs">Изготовление от 7 дней · Гарантия 1 год · Доставка по РФ</p>
        </div>
      </div>
    </footer>
  );
}

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-white">
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
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/"                   element={<Index />} />
                <Route path="/properties"         element={<Properties />} />
                <Route path="/properties/:id"     element={<PropertyDetail />} />
                <Route path="*"                   element={<NotFound />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
