import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/property-card"
import { MapPin, Home, Building, Filter } from "lucide-react"

export default function HomePage() {
  const featuredProperties = [
    {
      id: "1",
      title: "Бытовка строительная 6×2.4 м",
      type: "Бытовка",
      address: "Отправка по всей России",
      price: 189000,
      bedrooms: 1,
      bathrooms: 0,
      squareFeet: 14,
      yearBuilt: 2024,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "2",
      title: "Ночной домик 6×3 м с санузлом",
      type: "Ночной домик",
      address: "Отправка по всей России",
      price: 390000,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 18,
      yearBuilt: 2024,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "3",
      title: "Хостблок на 8 мест 12×3 м",
      type: "Хостблок",
      address: "Отправка по всей России",
      price: 890000,
      bedrooms: 4,
      bathrooms: 2,
      squareFeet: 36,
      yearBuilt: 2024,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Модульные строения на металлокаркасе
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Бытовки, ночные домики и хостблоки собственного производства. Доставка по всей России. Изготовление от 7 дней.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/properties">
                  <Button size="lg" className="gap-1.5">
                    <Home className="h-4 w-4" />
                    Смотреть каталог
                  </Button>
                </Link>
                <Link to="/properties/new">
                  <Button size="lg" variant="outline" className="gap-1.5">
                    <Building className="h-4 w-4" />
                    Заказать расчёт
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-lg border bg-background p-4 shadow-sm">
                <div className="flex items-center gap-2 pb-4">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Быстрый поиск</h2>
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Цена от
                      </label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="">Любая</option>
                        <option value="100000">100 тыс</option>
                        <option value="300000">300 тыс</option>
                        <option value="500000">500 тыс</option>
                        <option value="1000000">1 млн</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Цена до
                      </label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="">Любая</option>
                        <option value="300000">300 тыс</option>
                        <option value="600000">600 тыс</option>
                        <option value="1000000">1 млн</option>
                        <option value="3000000">3+ млн</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Мест / блоков
                      </label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="">Любое</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="8">8+</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        С санузлом
                      </label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="">Любое</option>
                        <option value="yes">Да</option>
                        <option value="no">Нет</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Тип строения
                    </label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="">Любой</option>
                      <option value="bytovka">Бытовка</option>
                      <option value="domik">Ночной домик</option>
                      <option value="hostblock">Хостблок</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Ваш регион доставки"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Link to="/properties">
                    <Button className="w-full">Найти строения</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 pb-8 md:flex-row">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter">Популярные модели</h2>
              <p className="text-muted-foreground">Готовые решения из нашего производственного каталога</p>
            </div>
            <Link to="/properties">
              <Button variant="outline">Весь каталог</Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}