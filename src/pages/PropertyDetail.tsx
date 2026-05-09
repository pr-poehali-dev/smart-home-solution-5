import { Link, useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Square, Home, ChevronRight, Share2, ShoppingCart } from "lucide-react"
import Icon from "@/components/ui/icon"

export default function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: property.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Ссылка скопирована!")
    }
  }

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
          <p className="text-3xl font-bold">{formatPrice(property.price)}</p>
          <div className="flex gap-2">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate("/properties/new")}
            >
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
        {/* Главное фото */}
        <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingTop: "75%" }}>
          <img
            src={property.images[0]}
            alt={property.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        {/* Мелкие фото */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {property.images.slice(1, 5).map((image, i) => (
            <div key={i} className="relative overflow-hidden rounded-lg" style={{ paddingTop: "75%" }}>
              <img
                src={image}
                alt={`${property.title} ${i + 2}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Описание + Характеристики (теги) */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">Описание</h2>
          <p className="text-muted-foreground leading-relaxed">{property.description}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Характеристики</h2>
          <div className="flex flex-wrap gap-2">
            {property.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-full border border-input bg-muted px-3 py-1 text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}