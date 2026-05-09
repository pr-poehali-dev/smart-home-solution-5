import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Home, Building, Search, Menu, X } from "lucide-react"
import { useState } from "react"

export function MainNav() {
  const location = useLocation()
  const pathname = location.pathname
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Главная",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/properties",
      label: "Объекты",
      icon: Building,
      active: pathname === "/properties" || pathname.startsWith("/properties/"),
    },
    {
      href: "/search",
      label: "Поиск",
      icon: Search,
      active: pathname === "/search",
    },
  ]

  return (
    <>
      <div className="hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            {routes.map((route) => (
              <NavigationMenuItem key={route.href}>
                <Link to={route.href}>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "px-4",
                      route.active && "bg-accent text-accent-foreground",
                    )}
                  >
                    {route.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Полезное</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">Гид по недвижимости</div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Всё, что нужно знать о покупке и продаже недвижимости
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <Link to="/guides/buying">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Гид покупателя</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Советы для тех, кто покупает впервые
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link to="/guides/selling">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Гид продавца</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Как получить лучшую цену за вашу недвижимость
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link to="/mortgage-calculator">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Ипотечный калькулятор</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Рассчитайте ежемесячные платежи
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background p-4 md:hidden">
          <nav className="grid gap-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-lg",
                  route.active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <route.icon className="h-5 w-5" />
                {route.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            <Link
              to="/guides/buying"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-lg hover:bg-accent hover:text-accent-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Гид покупателя
            </Link>
            <Link
              to="/guides/selling"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-lg hover:bg-accent hover:text-accent-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Гид продавца
            </Link>
            <Link
              to="/mortgage-calculator"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-lg hover:bg-accent hover:text-accent-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ипотечный калькулятор
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
