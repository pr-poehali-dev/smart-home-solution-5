import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { User, Plus } from "lucide-react";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import NewProperty from "./pages/NewProperty";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/" className="font-bold text-xl">
            НовоДом
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link to="/properties/new">
            <Button size="sm" className="hidden gap-1 md:flex">
              <Plus className="h-4 w-4" />
              Разместить
            </Button>
          </Link>
          <Button variant="ghost" size="icon" aria-label="User account">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
    <main className="flex-1">{children}</main>
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          2024 НовоДом. Все права защищены.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link to="/terms" className="hover:underline">
            Условия
          </Link>
          <Link to="/privacy" className="hover:underline">
            Конфиденциальность
          </Link>
          <Link to="/contact" className="hover:underline">
            Контакты
          </Link>
        </div>
      </div>
    </footer>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/new" element={<NewProperty />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
