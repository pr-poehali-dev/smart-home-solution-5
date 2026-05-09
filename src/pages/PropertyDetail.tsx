import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Square, Home, ChevronRight, Share2, ShoppingCart } from "lucide-react"
import Icon from "@/components/ui/icon"

const MESSENGER_OPTIONS = [
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Только звонок" },
]

const fmt = (price: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price)

const fmtShort = (price: number) => {
  if (price >= 1000000) return `${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)} млн`
  return `${(price / 1000).toFixed(0)} тыс`
}

export default function PropertyDetailPage() {
  const { id } = useParams()

  const property = {
    id: id,
    title: "Хостблок на 8 мест 12×3 м",
    type: "Хостблок",
    squareFeet: 36,
    dimensions: "12×3×2.7 м",
    yearBuilt: 2024,
    status: "Доступно",
    price: 890000,
    description:
      "Хостблок на металлокаркасе 12×3 м — готовое решение для временного проживания рабочих и персонала. Вмещает 8 человек: 4 двухъярусные кровати, 2 санузла, электрика 220В. Каркас из профильной трубы 80×80 мм, обшивка металлопрофилем. Утепление минватой 100 мм. Изготовление 7–14 дней. Возможна любая кастомизация под задачи заказчика.",
    tags: [
      "Металлокаркас 80×80 мм",
      "Металлопрофиль",
      "Минвата 100 мм",
      "Электрика 220В",
      "Двойные двери",
      "Пластиковые окна",
      "Конвекторы",
      "Доставка по РФ",
      "Гарантия 1 год",
      "Срок: 7–14 дней",
    ],
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
  }

  // Модалка заказа
  const [orderOpen, setOrderOpen] = useState(false)
  const [budget, setBudget] = useState([property.price, Math.round(property.price * 1.3)])
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const [wishes, setWishes] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [messenger, setMessenger] = useState<string | null>(null)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: property.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Ссылка скопирована!")
    }
  }

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Заявка отправлена! Мы свяжемся с вами в ближайшее время.")
    setOrderOpen(false)
  }

  const budgetMax = Math.max(property.price * 2, 3000000)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Хлебные крошки */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 hover:text-foreground">
          <Home className="h-4 w-4" />
          Главная
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/properties" className="hover:text-foreground">
          Каталог
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground line-clamp-1">{property.title}</span>
      </div>

      {/* Заголовок + цена + кнопки */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-green-100 text-green-800">{property.status}</Badge>
            <Badge variant="outline">{property.type}</Badge>
          </div>
          <h1 className="text-2xl font-bold leading-snug">{property.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Square className="h-4 w-4" />
              <span className="text-sm">{property.squareFeet} м²</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="Ruler" size={16} />
              <span className="text-sm">{property.dimensions}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
          <p className="text-3xl font-bold">{fmt(property.price)}</p>
          <div className="flex gap-2">
            <Button size="lg" className="gap-2" onClick={() => setOrderOpen(true)}>
              <ShoppingCart className="h-4 w-4" />
              Заказать с доставкой
            </Button>
            <Button size="icon" variant="outline" onClick={handleShare} title="Поделиться">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Галерея 4:3 */}
      <div className="mb-8 space-y-3">
        <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingTop: "75%" }}>
          <img src={property.images[0]} alt={property.title} className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {property.images.slice(1, 5).map((image, i) => (
            <div key={i} className="relative overflow-hidden rounded-lg" style={{ paddingTop: "75%" }}>
              <img src={image} alt={`${property.title} ${i + 2}`} className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Описание + Теги */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">Описание</h2>
          <p className="text-muted-foreground leading-relaxed">{property.description}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Характеристики</h2>
          <div className="flex flex-wrap gap-2">
            {property.tags.map((tag, i) => (
              <span key={i} className="rounded-full border border-input bg-muted px-3 py-1 text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Модалка заказа */}
      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Заказать с доставкой</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleOrderSubmit} className="space-y-5 pt-1">

            {/* Выбранный товар */}
            <div className="rounded-lg border bg-muted/40 p-3 flex items-center gap-3">
              <div className="relative w-20 shrink-0 overflow-hidden rounded-md" style={{ paddingTop: "33%" }}>
                <img src={property.images[0]} alt={property.title} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm line-clamp-2">{property.title}</p>
                <p className="text-sm text-muted-foreground">{property.squareFeet} м² · {property.dimensions}</p>
                <p className="text-sm font-bold">{fmt(property.price)}</p>
              </div>
            </div>

            {/* Бюджет от/до */}
            <div className="space-y-3">
              <Label>Бюджет</Label>
              <Slider
                value={budget}
                min={100000}
                max={budgetMax}
                step={50000}
                onValueChange={setBudget}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>от {fmtShort(budget[0])} ₽</span>
                <span>до {budget[1] >= budgetMax ? `${fmtShort(budgetMax)}+ ₽` : `${fmtShort(budget[1])} ₽`}</span>
              </div>
            </div>

            {/* Адрес доставки */}
            <div className="space-y-2">
              <Label>Адрес доставки</Label>
              <button
                type="button"
                onClick={() => setDeliveryOpen(true)}
                className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-left hover:bg-accent transition-colors"
              >
                <Icon name="MapPin" size={15} className="text-muted-foreground shrink-0" />
                <span className={deliveryAddress ? "text-foreground" : "text-muted-foreground"}>
                  {deliveryAddress || "Укажите адрес доставки"}
                </span>
              </button>
            </div>

            {/* Пожелания */}
            <div className="space-y-2">
              <Label htmlFor="wishes">Пожелания</Label>
              <Textarea
                id="wishes"
                placeholder="Утепление, цвет, дополнительные двери, планировка..."
                value={wishes}
                onChange={(e) => setWishes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            {/* Имя + Телефон */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="order-name">Ваше имя</Label>
                <Input id="order-name" placeholder="Иван" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order-phone">Телефон</Label>
                <Input id="order-phone" type="tel" placeholder="+7 (___) ___-__-__" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            {/* Мессенджер */}
            <div className="space-y-2">
              <Label>Куда написать</Label>
              <div className="grid grid-cols-3 gap-2">
                {MESSENGER_OPTIONS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMessenger(messenger === m.value ? null : m.value)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                      messenger === m.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Оставить заявку
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Диалог адреса */}
      <Dialog open={deliveryOpen} onOpenChange={setDeliveryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Адрес доставки</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div className="space-y-2">
              <Label>Введите адрес</Label>
              <Input
                placeholder="Город, улица, дом..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>
            <div className="flex h-44 items-center justify-center rounded-md border bg-muted flex-col gap-2 text-muted-foreground">
              <Icon name="Map" size={30} />
              <span className="text-sm">Выбор по карте</span>
              <span className="text-xs text-center px-6">Будет подключена после настройки API</span>
            </div>
            <Button className="w-full" onClick={() => setDeliveryOpen(false)}>Подтвердить адрес</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
