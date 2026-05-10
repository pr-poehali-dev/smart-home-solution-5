import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Icon from "@/components/ui/icon"
import { api } from "@/lib/api"

const CABIN_IMAGE = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/f7142cb7-a7a3-4830-b4c0-37d7d57b5d57.jpg"
const PRODUCT_IMAGE = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/921f3008-7ef0-4113-9f74-dc48c87d7ccc.jpg"

const TYPES = ["Все", "Бытовка", "Дачный домик", "Хостблок", "Баня", "Блок-контейнер"]

const STATIC_PRODUCTS = [
  { id: "1", name: "Бытовка строительная 6×2.4 м", type: "Бытовка", price: 189000, area: 14, dims: "6×2.4×2.5 м", badge: "ХИТ", badgeColor: "bg-red-600", img: PRODUCT_IMAGE, winter: false },
  { id: "2", name: "Бытовка с тамбуром 6×3 м", type: "Бытовка", price: 245000, area: 18, dims: "6×3×2.5 м", badge: "В наличии", badgeColor: "bg-emerald-600", img: PRODUCT_IMAGE, winter: false },
  { id: "3", name: "Дачный домик с террасой 6×4 м", type: "Дачный домик", price: 420000, area: 24, dims: "6×4×3 м", badge: "Можно жить зимой", badgeColor: "bg-blue-600", img: CABIN_IMAGE, winter: true },
  { id: "4", name: "Блок-контейнер под офис", type: "Блок-контейнер", price: 320000, area: 14, dims: "6×2.4×2.6 м", badge: "В наличии", badgeColor: "bg-emerald-600", img: PRODUCT_IMAGE, winter: false },
  { id: "5", name: "Хостблок на 4 места 6×3 м", type: "Хостблок", price: 480000, area: 18, dims: "6×3×2.7 м", badge: "Хит продаж", badgeColor: "bg-red-600", img: PRODUCT_IMAGE, winter: false },
  { id: "6", name: "Хостблок на 8 мест 12×3 м", type: "Хостблок", price: 890000, area: 36, dims: "12×3×2.7 м", badge: "Можно жить зимой", badgeColor: "bg-blue-600", img: CABIN_IMAGE, winter: true },
]

type Product = typeof STATIC_PRODUCTS[0]

function fmt(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)} млн ₽`
  return `${(n / 1000).toFixed(0)} тыс ₽`
}

export default function PropertiesPage() {
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS)
  const [activeType, setActiveType] = useState("Все")
  const [search, setSearch] = useState("")
  const [maxPrice, setMaxPrice] = useState(3000000)
  const [sort, setSort] = useState<"price_asc" | "price_desc" | "newest">("newest")

  useEffect(() => {
    api.getProducts().then((data: unknown) => {
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data.map((p: Record<string, unknown>) => ({
          id: String(p.id),
          name: String(p.name || ""),
          type: String(p.type || ""),
          price: Number(p.price) || 0,
          area: Number(p.square_meters) || 0,
          dims: String(p.dimensions || ""),
          badge: p.is_featured ? "ХИТ" : "В наличии",
          badgeColor: p.is_featured ? "bg-red-600" : "bg-emerald-600",
          img: String(p.image_url || PRODUCT_IMAGE),
          winter: false,
        })))
      }
    }).catch(() => {})
  }, [])

  const filtered = products
    .filter(p => activeType === "Все" || p.type === activeType)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => p.price <= maxPrice)
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price
      if (sort === "price_desc") return b.price - a.price
      return parseInt(b.id) - parseInt(a.id)
    })

  return (
    <div style={{ background: '#0B1730' }} className="min-h-screen">

      {/* Header */}
      <section className="relative py-16 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(220,38,38,0.07) 0%, transparent 70%)' }} />
        <div className="container relative z-10">
          <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2">Каталог</p>
          <h1 className="font-montserrat text-3xl md:text-5xl font-extrabold text-white mb-3">Модульные строения</h1>
          <p className="text-white/50 max-w-xl">Бытовки, дачные домики, хостблоки и бани на металлокаркасе собственного производства. Изготовление от 7 дней.</p>
        </div>
      </section>

      <div className="container px-4 md:px-8 pb-24">
        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по названию..."
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-red-500/50 rounded-xl h-11"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as typeof sort)}
              className="px-4 py-2 rounded-xl text-sm text-white border border-white/10 bg-white/5 focus:outline-none focus:border-red-500/50 cursor-pointer"
            >
              <option value="newest" className="bg-[#0B1730]">Сначала новые</option>
              <option value="price_asc" className="bg-[#0B1730]">Цена: по возрастанию</option>
              <option value="price_desc" className="bg-[#0B1730]">Цена: по убыванию</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="rounded-2xl p-5" style={{ background: '#111F40' }}>
              <h3 className="font-montserrat font-bold text-white mb-4 text-sm uppercase tracking-wider">Тип строения</h3>
              <div className="space-y-1.5">
                {TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                      activeType === t
                        ? "bg-red-600 text-white font-semibold"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{t}</span>
                    {activeType === t && <Icon name="Check" size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: '#111F40' }}>
              <h3 className="font-montserrat font-bold text-white mb-4 text-sm uppercase tracking-wider">Бюджет до</h3>
              <p className="text-red-400 font-bold font-montserrat text-xl mb-3">{fmt(maxPrice)}</p>
              <input
                type="range"
                min={100000}
                max={3000000}
                step={50000}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>100 тыс</span><span>3 млн</span>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Phone" size={16} className="text-red-400" />
                <span className="font-bold text-white text-sm">Нужна помощь?</span>
              </div>
              <p className="text-white/50 text-xs mb-3">Подберём модель под ваши задачи и бюджет</p>
              <a href="#calc">
                <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs">
                  Бесплатная консультация
                </Button>
              </a>
            </div>
          </aside>

          {/* Grid */}
          <div>
            {/* Mobile type filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5 lg:hidden scrollbar-hide">
              {TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeType === t ? "bg-red-600 text-white" : "text-white/60 border border-white/15 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <p className="text-white/40 text-sm mb-4">{filtered.length} моделей</p>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="PackageX" size={48} className="text-white/20 mx-auto mb-4" />
                <p className="text-white/40 text-lg">Ничего не найдено</p>
                <p className="text-white/25 text-sm mt-1">Попробуйте изменить фильтры</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map(p => (
                  <Link key={p.id} to={`/properties/${p.id}`} className="group block">
                    <div className="rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                      style={{ background: '#111F40', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                      <div className="relative h-48 overflow-hidden">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111F40 0%, transparent 60%)' }} />
                        <span className={`absolute top-3 left-3 ${p.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>{p.badge}</span>
                        {p.winter && (
                          <span className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Icon name="Snowflake" size={10} />Зима
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{p.type}</p>
                        <h3 className="font-montserrat font-bold text-white text-base mb-2 group-hover:text-red-400 transition-colors leading-snug">{p.name}</h3>
                        <div className="flex gap-3 text-white/40 text-xs mb-3">
                          <span className="flex items-center gap-1"><Icon name="Maximize2" size={11} />{p.area} м²</span>
                          <span className="flex items-center gap-1"><Icon name="Ruler" size={11} />{p.dims}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/30 text-xs">от</p>
                            <p className="font-montserrat font-black text-white text-lg">{fmt(p.price)}</p>
                          </div>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs px-3 shadow-lg shadow-red-900/30">
                            Расчёт <Icon name="ArrowRight" size={12} className="ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
