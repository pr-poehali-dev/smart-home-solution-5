import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Icon from "@/components/ui/icon"
import { Home, ChevronRight, X } from "lucide-react"

const BUILDING_TYPES = ["Бытовка", "Дачный домик", "Хостблок", "Баня"]

const MESSENGER_OPTIONS = [
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Только звонок" },
]

const formatPrice = (price: number) => {
  if (price >= 1000000) return `${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)} млн`
  return `${(price / 1000).toFixed(0)} тыс`
}

export default function NewPropertyPage() {
  const [images, setImages] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [budget, setBudget] = useState([300000, 1500000])
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const [messenger, setMessenger] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages].slice(0, 10))
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Заявка отправлена! Мы свяжемся с вами в ближайшее время.")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 hover:text-foreground">
          <Home className="h-4 w-4" />
          Главная
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Заказать</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Заявка на расчёт</h1>
        <p className="text-muted-foreground">Заполните форму — мы перезвоним и рассчитаем стоимость</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Фото */}
        <Card>
          <CardHeader>
            <CardTitle>Фото / эскиз</CardTitle>
            <CardDescription>Загрузите референс или эскиз, если есть (до 10 фото)</CardDescription>
          </CardHeader>
          <CardContent>
            <label
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-background p-6 text-center cursor-pointer hover:bg-accent transition-colors"
            >
              <Icon name="Upload" size={28} className="text-muted-foreground" />
              <span className="text-sm font-medium">Нажмите или перетащите файлы</span>
              <span className="text-xs text-muted-foreground">JPG, PNG, WEBP до 10 МБ</span>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((src, i) => (
                  <div key={i} className="relative rounded-md overflow-hidden" style={{ paddingTop: "75%" }}>
                    <img src={src} alt={`preview-${i}`} className="absolute inset-0 h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Тип строения */}
        <Card>
          <CardHeader>
            <CardTitle>Тип строения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {BUILDING_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                  className={`rounded-md border px-4 py-3 text-sm font-medium text-center transition-colors ${
                    selectedType === type
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Бюджет */}
        <Card>
          <CardHeader>
            <CardTitle>Бюджет</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Slider
              value={budget}
              min={100000}
              max={5000000}
              step={50000}
              onValueChange={setBudget}
            />
            <div className="flex items-center justify-between gap-2">
              <div className="rounded-md border bg-muted px-3 py-1.5 text-sm font-medium min-w-[100px] text-center">
                от {formatPrice(budget[0])} ₽
              </div>
              <div className="h-px flex-1 bg-border" />
              <div className="rounded-md border bg-muted px-3 py-1.5 text-sm font-medium min-w-[100px] text-center">
                {budget[1] >= 5000000 ? "до 5+ млн ₽" : `до ${formatPrice(budget[1])} ₽`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Адрес доставки */}
        <Card>
          <CardHeader>
            <CardTitle>Адрес доставки</CardTitle>
            <CardDescription>Куда доставить готовое строение?</CardDescription>
          </CardHeader>
          <CardContent>
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
                  <Button onClick={() => setDeliveryOpen(false)}>Подтвердить адрес</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Контакты */}
        <Card>
          <CardHeader>
            <CardTitle>Как с вами связаться</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Ваше имя</Label>
                <Input id="name" placeholder="Иван" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Номер телефона</Label>
                <Input id="phone" type="tel" placeholder="+7 (___) ___-__-__" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Куда написать</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full">
          Отправить заявку
        </Button>
      </form>
    </div>
  )
}