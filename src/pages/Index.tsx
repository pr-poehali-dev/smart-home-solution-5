import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Icon from "@/components/ui/icon"
import { api } from "@/lib/api"

const HERO_IMAGE = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/aa6a31fa-0e86-4f84-9741-5df84ca11964.jpg"
const FACTORY_IMAGE = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/2ba009f3-456b-4910-bf53-ad0b06374dce.jpg"
const CABIN_IMAGE = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/f7142cb7-a7a3-4830-b4c0-37d7d57b5d57.jpg"
const PERSON_IMAGE = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/bucket/be422675-e95a-46b9-96a7-02a66c484ed9.png"

const STATS = [
  { num: "500+", label: "объектов сдано", icon: "Building2" },
  { num: "7", label: "дней производство", icon: "Clock" },
  { num: "1 год", label: "гарантия", icon: "Shield" },
  { num: "РФ", label: "доставка везде", icon: "Truck" },
]

const PRODUCTS = [
  {
    id: "1",
    name: "Бытовка строительная",
    type: "Бытовка",
    price: 189000,
    area: 14,
    dims: "6×2.4×2.5 м",
    badge: "ХИТ",
    badgeColor: "bg-red-600",
    tags: ["Металлокаркас", "Утепление 100 мм", "Электрика"],
    img: "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/921f3008-7ef0-4113-9f74-dc48c87d7ccc.jpg",
    winter: false,
  },
  {
    id: "2",
    name: "Дачный домик с террасой",
    type: "Дачный домик",
    price: 420000,
    area: 24,
    dims: "6×4×3 м",
    badge: "Можно жить зимой",
    badgeColor: "bg-blue-600",
    tags: ["Утепление 150 мм", "Терраса", "Санузел"],
    img: CABIN_IMAGE,
    winter: true,
  },
  {
    id: "3",
    name: "Хостблок на 8 мест",
    type: "Хостблок",
    price: 890000,
    area: 36,
    dims: "12×3×2.7 м",
    badge: "В наличии",
    badgeColor: "bg-emerald-600",
    tags: ["8 спальных мест", "2 санузла", "Электрика 220В"],
    img: "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/921f3008-7ef0-4113-9f74-dc48c87d7ccc.jpg",
    winter: false,
  },
]

const WHY = [
  { icon: "Factory", title: "Собственное производство", text: "Делаем сами — нет посредников. Контроль качества на каждом этапе." },
  { icon: "Truck", title: "Доставка манипулятором", text: "Привезём и установим за 1 день. Работаем по всей России." },
  { icon: "FileText", title: "Договор и гарантия", text: "Работаем официально по договору. Гарантия 1 год на всю конструкцию." },
  { icon: "Thermometer", title: "Тёплые круглый год", text: "Минвата 150 мм, двойные стеклопакеты. Комфортно при −40°C." },
  { icon: "Zap", title: "Изготовление от 7 дней", text: "Быстрее рынка в 3 раза. Точные сроки без переносов." },
  { icon: "Wrench", title: "Любая кастомизация", text: "Размер, планировка, отделка — делаем под ваш проект." },
]

const HOW = [
  { step: "01", title: "Оставляете заявку", text: "Звоните или пишите в Telegram. Ответим за 15 минут." },
  { step: "02", title: "Согласовываем проект", text: "Выбираем размер, комплектацию, считаем стоимость — бесплатно." },
  { step: "03", title: "Производим", text: "Строим на нашем заводе. Отправляем фото и видео с производства." },
  { step: "04", title: "Доставляем и устанавливаем", text: "Манипулятором доставим и поставим точно на место в 1 день." },
]

const GALLERY = [
  { img: HERO_IMAGE, label: "Модульный дом в лесу" },
  { img: CABIN_IMAGE, label: "Дачный домик на закате" },
  { img: FACTORY_IMAGE, label: "Производство" },
  { img: "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/921f3008-7ef0-4113-9f74-dc48c87d7ccc.jpg", label: "Бытовка на объекте" },
]

function fmt(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)} млн ₽`
  return `${(n / 1000).toFixed(0)} тыс ₽`
}

function LeadForm({ compact = false }: { compact?: boolean }) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [msg, setMsg] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await api.createOrder({ name, phone, message: msg })
    setLoading(false)
    setSent(true)
  }

  if (sent) return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
        <Icon name="CheckCircle" size={32} className="text-emerald-400" />
      </div>
      <p className="text-lg font-semibold text-white mb-1">Заявка отправлена!</p>
      <p className="text-white/60 text-sm">Свяжемся с вами в течение 15 минут</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-white/70 text-xs mb-1 block">Ваше имя</Label>
          <Input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Александр"
            className="bg-white/10 border-white/15 text-white placeholder:text-white/30 focus:border-red-500"
            required
          />
        </div>
        <div>
          <Label className="text-white/70 text-xs mb-1 block">Телефон</Label>
          <Input
            value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="+7 (___) ___-__-__"
            className="bg-white/10 border-white/15 text-white placeholder:text-white/30 focus:border-red-500"
            required
          />
        </div>
      </div>
      {!compact && (
        <div>
          <Label className="text-white/70 text-xs mb-1 block">Что нужно? (необязательно)</Label>
          <Textarea
            value={msg} onChange={e => setMsg(e.target.value)}
            placeholder="Нужна бытовка 6×3 м, утеплённая, с электрикой..."
            rows={3}
            className="bg-white/10 border-white/15 text-white placeholder:text-white/30 focus:border-red-500 resize-none"
          />
        </div>
      )}
      <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-12 text-base shadow-lg shadow-red-900/30 transition-all duration-200 hover:shadow-red-900/50 hover:scale-[1.02]">
        {loading ? "Отправляем..." : "Получить расчёт бесплатно"}
      </Button>
      <p className="text-center text-white/40 text-xs">Ответим за 15 минут · Без спама</p>
    </form>
  )
}

export default function HomePage() {
  const [products, setProducts] = useState(PRODUCTS)

  useEffect(() => {
    api.getProducts(true).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data.slice(0, 3).map((p: Record<string, unknown>) => ({
          id: String(p.id),
          name: p.name,
          type: p.type,
          price: p.price,
          area: p.square_meters || 0,
          dims: p.dimensions || "",
          badge: p.is_featured ? "ХИТ" : "В наличии",
          badgeColor: p.is_featured ? "bg-red-600" : "bg-emerald-600",
          tags: [p.type, p.dimensions || "", `${p.square_meters || 0} м²`].filter(Boolean),
          img: p.image_url || CABIN_IMAGE,
          winter: false,
        })))
      }
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#0B1730' }}>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* BG image */}
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover object-center opacity-35" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #0B1730 50%, rgba(11,23,48,0.5) 100%)' }} />
          <div className="absolute inset-0 hero-glow" />
        </div>

        <div className="relative z-10 container px-4 md:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-medium text-red-400 border border-red-500/30" style={{ background: 'rgba(220,38,38,0.08)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Собственное производство · Изготовление от 7 дней
            </div>

            <h1 className="font-montserrat text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6 text-white">
              Тёплые модульные<br />
              <span style={{ color: '#DC2626' }}>дома и бытовки</span><br />
              с доставкой по России
            </h1>

            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed max-w-xl">
              Собственное производство. Изготовление от 7 дней.<br />Работаем по договору с гарантией.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-16">
              <Link to="/properties">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 text-base font-semibold shadow-lg shadow-red-900/40 transition-all duration-200 hover:shadow-red-900/60 hover:scale-[1.02] rounded-xl">
                  <Icon name="Grid3x3" size={18} className="mr-2" />
                  Смотреть каталог
                </Button>
              </Link>
              <a href="#calc">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold border-white/20 text-white hover:bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-200">
                  <Icon name="Calculator" size={18} className="mr-2" />
                  Получить расчёт
                </Button>
              </a>
            </div>

            {/* Floating stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATS.map((s) => (
                <div key={s.num} className="glass rounded-2xl px-4 py-3 text-center group hover:border-red-500/30 transition-all duration-300">
                  <p className="font-montserrat text-2xl font-black text-white mb-0.5">{s.num}</p>
                  <p className="text-white/50 text-xs leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Person on right */}
        <div className="absolute right-0 bottom-0 z-10 hidden lg:block w-[520px]">
          <img src={PERSON_IMAGE} alt="МодульСтрой" className="w-full object-contain object-bottom" style={{ maxHeight: '85vh' }} />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-float">
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-center justify-center">
            <div className="w-1 h-2 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section className="py-24 px-4 md:px-8">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2">Наши модели</p>
              <h2 className="font-montserrat text-3xl md:text-5xl font-extrabold text-white leading-tight">
                Популярные<br />модели
              </h2>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl h-11 px-6">
                Весь каталог
                <Icon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link key={p.id} to={`/properties/${p.id}`} className="group block">
                <div className="relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                  style={{ background: '#111F40', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111F40 0%, transparent 60%)' }} />
                    <span className={`absolute top-3 left-3 ${p.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {p.badge}
                    </span>
                    {p.winter && (
                      <span className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Icon name="Snowflake" size={11} />
                        Зима
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-white/50 text-xs mb-1 uppercase tracking-wider">{p.type}</p>
                    <h3 className="font-montserrat text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">{p.name}</h3>

                    <div className="flex items-center gap-4 text-white/50 text-sm mb-4">
                      <span className="flex items-center gap-1"><Icon name="Maximize2" size={13} />{p.area} м²</span>
                      <span className="flex items-center gap-1"><Icon name="Ruler" size={13} />{p.dims}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {p.tags.slice(0, 3).map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-md text-white/60 border border-white/10"
                          style={{ background: 'rgba(255,255,255,0.04)' }}>{t}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/40 text-xs mb-0.5">Стоимость</p>
                        <p className="font-montserrat text-2xl font-black text-white">от {fmt(p.price)}</p>
                      </div>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold px-4 shadow-lg shadow-red-900/30 transition-all duration-200 group-hover:shadow-red-900/50">
                        Расчёт
                        <Icon name="ArrowRight" size={13} className="ml-1.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY ===== */}
      <section className="py-24 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(220,38,38,0.06) 0%, transparent 70%)' }} />
        <div className="container relative z-10">
          <div className="text-center mb-14">
            <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2">Наши преимущества</p>
            <h2 className="font-montserrat text-3xl md:text-5xl font-extrabold text-white">Почему выбирают нас</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.title} className="group glass rounded-2xl p-6 transition-all duration-300 hover:border-red-500/30 hover:shadow-card-hover">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(220,38,38,0.12)' }}>
                  <Icon name={w.icon} size={22} className="text-red-400" />
                </div>
                <h3 className="font-montserrat text-base font-bold text-white mb-2">{w.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW WE WORK ===== */}
      <section className="py-24 px-4 md:px-8">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2">Просто и понятно</p>
              <h2 className="font-montserrat text-3xl md:text-5xl font-extrabold text-white mb-4">Как мы работаем</h2>
              <p className="text-white/50 mb-12">От заявки до установки — максимально прозрачно.</p>
              <div className="space-y-6">
                {HOW.map((h, i) => (
                  <div key={h.step} className="flex gap-5 group">
                    <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-montserrat text-lg font-black transition-all duration-300 group-hover:scale-110"
                      style={{ background: i === 0 ? '#DC2626' : 'rgba(255,255,255,0.06)', color: i === 0 ? 'white' : 'rgba(255,255,255,0.3)' }}>
                      {h.step}
                    </div>
                    <div className="pt-1">
                      <h3 className="font-montserrat font-bold text-white mb-1">{h.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{h.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-premium aspect-[4/3]">
                <img src={FACTORY_IMAGE} alt="Производство" className="w-full h-full object-cover" />
                <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.15) 0%, transparent 60%)' }} />
              </div>
              <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-glass">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
                    <Icon name="Clock" size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-montserrat text-xl font-black text-white">7 дней</p>
                    <p className="text-white/50 text-xs">среднее время изготовления</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section className="py-24 px-4 md:px-8">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2">Наши работы</p>
            <h2 className="font-montserrat text-3xl md:text-5xl font-extrabold text-white">Атмосфера жизни</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GALLERY.map((g, i) => (
              <div key={i} className={`relative rounded-2xl overflow-hidden group cursor-pointer ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                style={{ aspectRatio: i === 0 ? '1/1' : '4/3' }}>
                <img src={g.img} alt={g.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(to top, rgba(11,23,48,0.9) 0%, transparent 60%)' }} />
                <p className="absolute bottom-4 left-4 text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">{g.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LEAD FORM ===== */}
      <section id="calc" className="py-24 px-4 md:px-8">
        <div className="container">
          <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-premium relative">
            <div className="absolute inset-0 z-0">
              <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(11,23,48,0.97) 0%, rgba(30,10,10,0.92) 100%)' }} />
            </div>
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="flex-1">
                  <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2">Бесплатно</p>
                  <h2 className="font-montserrat text-3xl md:text-4xl font-extrabold text-white mb-3">Получите расчёт за 15 минут</h2>
                  <p className="text-white/50 mb-8 leading-relaxed">Опишите задачу — рассчитаем стоимость, подберём комплектацию и ответим на все вопросы.</p>
                  <div className="space-y-3">
                    {["Расчёт — бесплатно и быстро", "Работаем по всей России", "Договор с гарантией"].map(t => (
                      <div key={t} className="flex items-center gap-2 text-white/60 text-sm">
                        <Icon name="Check" size={15} className="text-red-400 shrink-0" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <LeadForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}