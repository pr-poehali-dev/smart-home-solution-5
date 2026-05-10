import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Icon from "@/components/ui/icon"
import { api } from "@/lib/api"

const CABIN_IMAGE = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/f7142cb7-a7a3-4830-b4c0-37d7d57b5d57.jpg"
const FACTORY_IMAGE = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/2ba009f3-456b-4910-bf53-ad0b06374dce.jpg"
const HERO_IMAGE = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/aa6a31fa-0e86-4f84-9741-5df84ca11964.jpg"
const PRODUCT_IMAGE = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/921f3008-7ef0-4113-9f74-dc48c87d7ccc.jpg"

const STATIC_PRODUCTS: Record<string, {
  id: string; name: string; type: string; price: number; area: number; dims: string;
  desc: string; tags: string[]; imgs: string[]; badge: string;
}> = {
  "1": { id: "1", name: "Бытовка строительная 6×2.4 м", type: "Бытовка", price: 189000, area: 14, dims: "6×2.4×2.5 м", badge: "ХИТ",
    desc: "Классическая строительная бытовка на металлокаркасе. Надёжная, тёплая, готова к работе. Утепление 100 мм минватой, металлопрофиль снаружи, вагонка внутри. Электрика 220В. Изготовление 7–10 дней.",
    tags: ["Металлокаркас 80×80 мм", "Минвата 100 мм", "Металлопрофиль", "Вагонка", "Электрика 220В", "Пластиковые окна", "Гарантия 1 год", "Доставка по РФ"],
    imgs: [PRODUCT_IMAGE, CABIN_IMAGE, FACTORY_IMAGE, HERO_IMAGE] },
  "2": { id: "2", name: "Бытовка с тамбуром 6×3 м", type: "Бытовка", price: 245000, area: 18, dims: "6×3×2.5 м", badge: "В наличии",
    desc: "Бытовка с отдельным тамбуром — меньше теплопотерь, удобный вход. Утепление 100 мм, металлосайдинг, полы с утеплением. Электрика 220В, освещение.",
    tags: ["Тамбур", "Минвата 100 мм", "Металлосайдинг", "Утеплённый пол", "Электрика 220В", "Гарантия 1 год"],
    imgs: [PRODUCT_IMAGE, FACTORY_IMAGE, CABIN_IMAGE, HERO_IMAGE] },
  "3": { id: "3", name: "Дачный домик с террасой 6×4 м", type: "Дачный домик", price: 420000, area: 24, dims: "6×4×3 м", badge: "Можно жить зимой",
    desc: "Уютный дачный домик с открытой террасой. Утепление 150 мм — комфортно при −40°C. Металлосайдинг снаружи, вагонка внутри. Санузел, большие панорамные окна.",
    tags: ["Терраса", "Минвата 150 мм", "Санузел", "Панорамные окна", "Металлосайдинг", "Электрика 220В", "Зима −40°C", "Гарантия 1 год"],
    imgs: [CABIN_IMAGE, HERO_IMAGE, PRODUCT_IMAGE, FACTORY_IMAGE] },
  "4": { id: "4", name: "Блок-контейнер под офис", type: "Блок-контейнер", price: 320000, area: 14, dims: "6×2.4×2.6 м", badge: "В наличии",
    desc: "Блок-контейнер под мобильный офис или склад. Металлопрофиль, двойные двери, вентиляция, электрика, освещение. Быстрый монтаж, лёгкий перенос.",
    tags: ["Металлопрофиль", "Двойные двери", "Вентиляция", "Электрика 220В", "Освещение", "Гарантия 1 год"],
    imgs: [PRODUCT_IMAGE, FACTORY_IMAGE, HERO_IMAGE, CABIN_IMAGE] },
  "5": { id: "5", name: "Хостблок на 4 места 6×3 м", type: "Хостблок", price: 480000, area: 18, dims: "6×3×2.7 м", badge: "Хит продаж",
    desc: "Хостблок на 4 спальных места. 2 двухъярусные кровати, санузел, электрика. Металлокаркас 80×80 мм, утепление 100 мм. Для строительных бригад, вахтовиков, арендных объектов.",
    tags: ["4 спальных места", "Санузел", "Минвата 100 мм", "Металлокаркас", "Электрика 220В", "Гарантия 1 год"],
    imgs: [PRODUCT_IMAGE, CABIN_IMAGE, FACTORY_IMAGE, HERO_IMAGE] },
  "6": { id: "6", name: "Хостблок на 8 мест 12×3 м", type: "Хостблок", price: 890000, area: 36, dims: "12×3×2.7 м", badge: "Можно жить зимой",
    desc: "Хостблок на 8 спальных мест — готовое решение для временного проживания. 4 двухъярусные кровати, 2 санузла, электрика 220В. Утепление 150 мм, комфортно зимой.",
    tags: ["8 спальных мест", "2 санузла", "Минвата 150 мм", "Металлокаркас 80×80 мм", "Электрика 220В", "Зима −40°C", "Гарантия 1 год", "Срок 7–14 дней"],
    imgs: [CABIN_IMAGE, PRODUCT_IMAGE, FACTORY_IMAGE, HERO_IMAGE] },
}

const RELATED_PRODUCTS = [
  { id: "1", name: "Бытовка 6×2.4 м", price: 189000, img: PRODUCT_IMAGE },
  { id: "3", name: "Дачный домик 6×4 м", price: 420000, img: CABIN_IMAGE },
  { id: "6", name: "Хостблок 12×3 м", price: 890000, img: CABIN_IMAGE },
]

function fmt(n: number) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n)
}
function fmtShort(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)} млн`
  return `${(n / 1000).toFixed(0)} тыс`
}

export default function PropertyDetailPage() {
  const { id } = useParams()
  const [activeImg, setActiveImg] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [msg, setMsg] = useState("")

  const product = STATIC_PRODUCTS[id || "1"] || STATIC_PRODUCTS["1"]

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await api.createOrder({ name, phone, message: msg, product_name: product.name, product_id: parseInt(product.id) })
    setLoading(false)
    setSent(true)
  }

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  return (
    <div style={{ background: '#0B1730' }} className="min-h-screen pb-24">

      {/* Fullscreen */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setFullscreen(false)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white" onClick={() => setFullscreen(false)}>
            <Icon name="X" size={28} />
          </button>
          <img src={product.imgs[activeImg]} alt="" className="max-w-full max-h-full object-contain rounded-xl" />
        </div>
      )}

      <div className="container px-4 md:px-8 pt-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Главная</Link>
          <Icon name="ChevronRight" size={14} />
          <Link to="/properties" className="hover:text-white transition-colors">Каталог</Link>
          <Icon name="ChevronRight" size={14} />
          <span className="text-white/70 line-clamp-1">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-10 xl:gap-16">
          {/* Left: Gallery + info */}
          <div>
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/10] mb-3 cursor-pointer group" onClick={() => setFullscreen(true)}>
              <img src={product.imgs[activeImg]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div className="glass rounded-full p-3">
                  <Icon name="Expand" size={22} className="text-white" />
                </div>
              </div>
              <span className={`absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full`}>{product.badge}</span>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mb-8">
              {product.imgs.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative flex-1 rounded-xl overflow-hidden aspect-video transition-all duration-200 ${activeImg === i ? 'ring-2 ring-red-500 opacity-100' : 'opacity-50 hover:opacity-80'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Title + specs */}
            <div className="mb-8">
              <p className="text-red-500 text-xs font-semibold uppercase tracking-widest mb-2">{product.type}</p>
              <h1 className="font-montserrat text-3xl md:text-4xl font-extrabold text-white mb-4">{product.name}</h1>

              <div className="flex flex-wrap gap-4 mb-6">
                {[
                  { icon: "Maximize2", label: `${product.area} м²` },
                  { icon: "Ruler", label: product.dims },
                  { icon: "Clock", label: "от 7 дней" },
                  { icon: "Shield", label: "Гарантия 1 год" },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2 text-white/60 text-sm">
                    <Icon name={s.icon} size={14} className="text-red-400" />
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>

              <p className="text-white/60 leading-relaxed mb-6">{product.desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.tags.map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-xs text-white/70 px-3 py-1.5 rounded-full border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <Icon name="Check" size={11} className="text-red-400" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Why us mini */}
            <div className="rounded-2xl p-5 mb-8" style={{ background: '#111F40' }}>
              <h3 className="font-montserrat font-bold text-white mb-4 text-sm uppercase tracking-wider">Почему выбирают нас</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: "Factory", text: "Собственное производство без посредников" },
                  { icon: "Truck", text: "Доставка манипулятором по всей России" },
                  { icon: "FileText", text: "Официальный договор с гарантией" },
                  { icon: "Thermometer", text: "Утепление для работы при −40°C" },
                ].map(w => (
                  <div key={w.text} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(220,38,38,0.15)' }}>
                      <Icon name={w.icon} size={13} className="text-red-400" />
                    </div>
                    <p className="text-white/60 text-sm leading-snug">{w.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-3xl overflow-hidden shadow-premium" style={{ background: '#111F40' }}>
              <div className="p-6 border-b border-white/8">
                <p className="text-white/40 text-xs mb-1">Стоимость</p>
                <p className="font-montserrat text-4xl font-black text-white mb-0.5">от {fmt(product.price)}</p>
                <p className="text-white/40 text-xs">Окончательная цена — после расчёта</p>
              </div>

              <div className="p-6">
                {sent ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                      <Icon name="CheckCircle" size={32} className="text-emerald-400" />
                    </div>
                    <p className="font-montserrat font-bold text-white text-lg mb-1">Заявка отправлена!</p>
                    <p className="text-white/50 text-sm">Свяжемся за 15 минут</p>
                  </div>
                ) : (
                  <form onSubmit={handleOrder} className="space-y-3">
                    <h3 className="font-montserrat font-bold text-white text-lg mb-4">Получить расчёт</h3>
                    <div>
                      <Label className="text-white/60 text-xs mb-1.5 block">Ваше имя</Label>
                      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Александр"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-red-500/60 rounded-xl" required />
                    </div>
                    <div>
                      <Label className="text-white/60 text-xs mb-1.5 block">Телефон</Label>
                      <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-red-500/60 rounded-xl" required />
                    </div>
                    <div>
                      <Label className="text-white/60 text-xs mb-1.5 block">Пожелания (необязательно)</Label>
                      <Textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3}
                        placeholder="Размер, комплектация, адрес доставки..."
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-red-500/60 rounded-xl resize-none" />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-13 bg-red-600 hover:bg-red-700 text-white font-semibold text-base rounded-xl shadow-lg shadow-red-900/30 transition-all duration-200 hover:shadow-red-900/50 hover:scale-[1.02] mt-1">
                      {loading ? "Отправляем..." : "Получить расчёт бесплатно"}
                    </Button>
                    <div className="flex items-center justify-center gap-4 pt-1">
                      <a href="https://t.me/" target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-blue-400 transition-colors">
                        <Icon name="Send" size={13} />Telegram
                      </a>
                      <span className="text-white/15">·</span>
                      <a href="https://wa.me/" target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-emerald-400 transition-colors">
                        <Icon name="MessageCircle" size={13} />WhatsApp
                      </a>
                    </div>
                    <p className="text-center text-white/30 text-xs">Без спама · Ответим за 15 минут</p>
                  </form>
                )}
              </div>

              <div className="px-6 pb-5 flex items-center gap-3 border-t border-white/8 pt-4">
                <div className="w-9 h-9 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <Icon name="Phone" size={15} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">+7 (800) 000-00-00</p>
                  <p className="text-white/40 text-xs">Пн–Пт 9:00–18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-20">
          <h2 className="font-montserrat text-2xl font-bold text-white mb-6">Похожие модели</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {RELATED_PRODUCTS.filter(r => r.id !== id).slice(0, 3).map(r => (
              <Link key={r.id} to={`/properties/${r.id}`} className="group block">
                <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]" style={{ background: '#111F40' }}>
                  <div className="h-36 overflow-hidden">
                    <img src={r.img} alt={r.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-montserrat font-bold text-white text-sm mb-1 group-hover:text-red-400 transition-colors">{r.name}</h3>
                    <p className="font-montserrat font-black text-white">от {fmtShort(r.price)} ₽</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA on mobile */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 p-4 border-t"
        style={{ background: 'rgba(11,23,48,0.95)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-white/50 text-xs">Стоимость</p>
            <p className="font-montserrat font-black text-white">от {fmt(product.price)}</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 font-semibold shadow-lg shadow-red-900/40"
            onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}>
            Получить расчёт
          </Button>
        </div>
      </div>
    </div>
  )
}
