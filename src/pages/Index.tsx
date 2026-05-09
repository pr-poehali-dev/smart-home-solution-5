import { Link } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/property-card"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"
import { Home, Building, Filter } from "lucide-react"

const BUILDING_TYPES = [
  { value: "bytovka", label: "Бытовка" },
  { value: "dacha", label: "Дачный домик" },
  { value: "hostblock", label: "Хостблок" },
  { value: "banya", label: "Баня" },
]

export default function HomePage() {
  const [priceRange, setPriceRange] = useState([100000, 3000000])
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [deliveryOpen, setDeliveryOpen] = useState(false)
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
      dimensions: "6×2.4×2.5 м",
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
      dimensions: "6×3×2.7 м",
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
      dimensions: "12×3×2.7 м",
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
              <div className="w-full max-w-md rounded-lg border bg-background p-5 shadow-sm">
                <div className="flex items-center gap-2 pb-4">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Быстрый поиск</h2>
                </div>
                <div className="grid gap-5">

                  {/* Ползунок цены */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Бюджет</label>
                      <span className="text-sm text-muted-foreground">
                        {(priceRange[0] / 1000).toFixed(0)} тыс — {priceRange[1] >= 3000000 ? "3+ млн" : (priceRange[1] / 1000).toFixed(0) + " тыс"} ₽
                      </span>
                    </div>
                    <Slider
                      value={priceRange}
                      min={100000}
                      max={3000000}
                      step={50000}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>100 тыс</span>
                      <span>3+ млн</span>
                    </div>
                  </div>

                  {/* Тип строения — кнопки */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Тип строения</label>
                    <div className="grid grid-cols-2 gap-2">
                      {BUILDING_TYPES.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setSelectedType(selectedType === t.value ? null : t.value)}
                          className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                            selectedType === t.value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Доставка */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Адрес доставки</label>
                    <Dialog open={deliveryOpen} onOpenChange={setDeliveryOpen}>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-left hover:bg-accent transition-colors"
                        >
                          <Icon name="MapPin" size={16} className="text-muted-foreground shrink-0" />
                          <span className={deliveryAddress ? "text-foreground" : "text-muted-foreground"}>
                            {deliveryAddress || "Укажите адрес доставки"}
                          </span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Адрес доставки</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-2">
                          <div className="space-y-2">
                            <Label>Введите адрес вручную</Label>
                            <Input
                              placeholder="Город, улица, дом..."
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                            />
                          </div>
                          <div className="relative rounded-md border bg-muted overflow-hidden" style={{ height: 200 }}>
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                              <Icon name="Map" size={32} />
                              <span className="text-sm">Выбор по карте</span>
                              <span className="text-xs text-center px-4">Карта будет подключена после настройки API-ключа</span>
                            </div>
                          </div>
                          <Button onClick={() => setDeliveryOpen(false)} className="w-full">
                            Подтвердить адрес
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
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

      {/* Баннер с парнем */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="container px-4 md:px-6">
          <div className="grid items-end lg:grid-cols-[1fr_auto_1fr] min-h-[380px] md:min-h-[460px]">
            {/* Левый текст */}
            <div className="flex flex-col justify-center gap-4 py-12 pr-6 z-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-red-400">Собственное производство</p>
              <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                Строим быстро.<br />Доставляем по всей России.
              </h2>
              <p className="text-slate-400 max-w-sm md:text-lg">
                Бытовки, дачные домики, хостблоки и бани на металлокаркасе. Изготовление от 7 дней.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/properties">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white border-0">
                    Смотреть каталог
                  </Button>
                </Link>
                <Link to="/properties/new">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Заказать расчёт
                  </Button>
                </Link>
              </div>
            </div>

            {/* Парень по центру */}
            <div className="hidden lg:flex items-end justify-center self-end z-10" style={{ marginBottom: 0 }}>
              <img
                src="https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/bucket/be422675-e95a-46b9-96a7-02a66c484ed9.png"
                alt="МодульСтрой"
                className="h-[380px] md:h-[460px] w-auto object-contain object-bottom select-none"
                draggable={false}
              />
            </div>

            {/* Правые карточки-факты */}
            <div className="hidden lg:flex flex-col justify-center gap-4 py-12 pl-6 z-10">
              {[
                { num: "7", unit: "дней", label: "срок изготовления" },
                { num: "500+", unit: "", label: "объектов сдано" },
                { num: "1", unit: "год", label: "гарантия на конструкцию" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-white">
                    {item.num} <span className="text-red-400">{item.unit}</span>
                  </p>
                  <p className="text-sm text-slate-400 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Мобильное фото */}
        <div className="lg:hidden flex justify-center pb-8 px-4">
          <img
            src="https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/bucket/be422675-e95a-46b9-96a7-02a66c484ed9.png"
            alt="МодульСтрой"
            className="max-h-64 w-auto object-contain"
            draggable={false}
          />
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