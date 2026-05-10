import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const IMG_HERO = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/d86fb1b0-7b22-4cec-b1da-3a3216512f7a.jpg";
const IMG_SAUNA = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/639f572d-7ef2-4db5-a189-84ac4c9cadfe.jpg";
const IMG_INT = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/cbb14e09-7150-40dd-9492-1b7967e0ad27.jpg";
const IMG_FACTORY = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/2ba009f3-456b-4910-bf53-ad0b06374dce.jpg";
const IMG_PROD = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/921f3008-7ef0-4113-9f74-dc48c87d7ccc.jpg";
const IMG_CABIN = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/f7142cb7-a7a3-4830-b4c0-37d7d57b5d57.jpg";

type BadgeKey = "hit" | "available" | "winter" | "fast" | "popular";
const BADGE: Record<BadgeKey, { label: string; cls: string }> = {
  hit: { label: "ХИТ", cls: "bg-[#E53935] text-white" },
  available: { label: "В наличии", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  winter: { label: "Зима ✓", cls: "bg-blue-50 text-blue-700 border border-blue-200" },
  fast: { label: "Быстро", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  popular: { label: "Популярное", cls: "bg-violet-50 text-violet-700 border border-violet-200" },
};

const ALL = [
  { id: "1", name: "Бытовка строительная", type: "Бытовка", area: 14, dims: "6×2.4 м", price: 189000, badge: "hit" as BadgeKey, img: IMG_PROD, img2: IMG_FACTORY },
  { id: "2", name: "Бытовка с тамбуром", type: "Бытовка", area: 18, dims: "6×3 м", price: 245000, badge: "available" as BadgeKey, img: IMG_PROD, img2: IMG_INT },
  { id: "3", name: "Дачный домик с террасой", type: "Дачный домик", area: 24, dims: "6×4 м", price: 420000, badge: "winter" as BadgeKey, img: IMG_HERO, img2: IMG_CABIN },
  { id: "4", name: "Блок-контейнер офис", type: "Блок-контейнер", area: 14, dims: "6×2.4 м", price: 320000, badge: "fast" as BadgeKey, img: IMG_PROD, img2: IMG_FACTORY },
  { id: "5", name: "Хостблок на 4 места", type: "Хостблок", area: 18, dims: "6×3 м", price: 480000, badge: "popular" as BadgeKey, img: IMG_CABIN, img2: IMG_INT },
  { id: "6", name: "Хостблок на 8 мест", type: "Хостблок", area: 36, dims: "12×3 м", price: 890000, badge: "winter" as BadgeKey, img: IMG_CABIN, img2: IMG_HERO },
  { id: "7", name: "Баня на металлокаркасе", type: "Баня", area: 18, dims: "3×6 м", price: 360000, badge: "hit" as BadgeKey, img: IMG_SAUNA, img2: IMG_INT },
  { id: "8", name: "Баня с комнатой отдыха", type: "Баня", area: 24, dims: "4×6 м", price: 490000, badge: "winter" as BadgeKey, img: IMG_SAUNA, img2: IMG_CABIN },
  { id: "9", name: "Хозблок для дачи", type: "Хозблок", area: 9, dims: "3×3 м", price: 95000, badge: "fast" as BadgeKey, img: IMG_PROD, img2: IMG_FACTORY },
  { id: "10", name: "Дом для круглогодичного жилья", type: "Дачный домик", area: 36, dims: "6×6 м", price: 780000, badge: "winter" as BadgeKey, img: IMG_HERO, img2: IMG_INT },
  { id: "11", name: "Мобильный офис 3×6", type: "Блок-контейнер", area: 18, dims: "3×6 м", price: 290000, badge: "available" as BadgeKey, img: IMG_PROD, img2: IMG_FACTORY },
  { id: "12", name: "Модульный гараж", type: "Хозблок", area: 24, dims: "4×6 м", price: 210000, badge: "popular" as BadgeKey, img: IMG_PROD, img2: IMG_FACTORY },
];

const TYPES = ["Все", "Бытовка", "Дачный домик", "Баня", "Хостблок", "Блок-контейнер", "Хозблок"];

function fmt(n: number) {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)} млн ₽`;
  return `${(n/1000).toFixed(0)} тыс ₽`;
}

export default function PropertiesPage() {
  const [type, setType] = useState("Все");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sort, setSort] = useState<"price_asc" | "price_desc">("price_asc");

  const list = ALL
    .filter(p => type === "Все" || p.type === type)
    .filter(p => p.price <= maxPrice)
    .sort((a, b) => sort === "price_asc" ? a.price - b.price : b.price - a.price);

  return (
    <div style={{ background: "#F7F7F5" }} className="min-h-screen">
      <section className="bg-white border-b border-[#E5E5E3] py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#E53935] uppercase tracking-wider mb-2">Каталог</p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#111]">Модульные строения</h1>
              <p className="text-[#6B7280] mt-1.5">Собственное производство · доставка по всей России · от 7 дней</p>
            </div>
            <span className="text-sm text-[#9CA3AF] flex items-center gap-1.5"><Icon name="Package" size={14} />{list.length} моделей</span>
          </div>
          <div className="flex gap-2 flex-wrap mt-6">
            {TYPES.map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`h-8 px-4 rounded-full text-sm font-medium transition-all duration-150 ${type === t ? "bg-[#111] text-white" : "bg-[#F7F7F5] text-[#6B7280] border border-[#E5E5E3] hover:border-[#111] hover:text-[#111]"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-10">
        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          <aside className="hidden lg:block space-y-5">
            <div className="bg-white rounded-[16px] p-5 border border-[#E5E5E3]">
              <h3 className="text-sm font-semibold text-[#111] mb-3">Бюджет до</h3>
              <p className="text-xl font-bold text-[#111] mb-3">{fmt(maxPrice)}</p>
              <input type="range" min={50000} max={1000000} step={25000} value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))} className="w-full cursor-pointer accent-[#E53935]" />
              <div className="flex justify-between text-xs text-[#9CA3AF] mt-1"><span>50 тыс</span><span>1 млн</span></div>
            </div>
            <div className="bg-white rounded-[16px] p-5 border border-[#E5E5E3]">
              <h3 className="text-sm font-semibold text-[#111] mb-3">Сортировка</h3>
              {[{ v: "price_asc", l: "Сначала дешевле" }, { v: "price_desc", l: "Сначала дороже" }].map(s => (
                <button key={s.v} onClick={() => setSort(s.v as typeof sort)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-all ${sort === s.v ? "bg-[#111] text-white font-medium" : "text-[#6B7280] hover:bg-[#F7F7F5]"}`}>
                  {s.l}
                </button>
              ))}
            </div>
            <div className="rounded-[16px] p-5" style={{ background: "#fff5f5", border: "1px solid rgba(229,57,53,0.15)" }}>
              <Icon name="Phone" size={18} className="text-[#E53935] mb-2" />
              <p className="text-sm font-semibold text-[#111] mb-1">Нужна помощь?</p>
              <p className="text-xs text-[#6B7280] mb-3">Подберём модель под ваш бюджет</p>
              <a href="#calc" className="block w-full text-center h-9 leading-9 rounded-[10px] bg-[#E53935] text-white text-xs font-semibold hover:bg-[#C62828] transition-colors">
                Консультация
              </a>
            </div>
          </aside>

          <div>
            {list.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="PackageX" size={40} className="text-[#D1D1CF] mx-auto mb-3" />
                <p className="text-[#6B7280]">Нет моделей по фильтрам</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                {list.map(p => {
                  const badge = BADGE[p.badge];
                  return (
                    <Link key={p.id} to={`/properties/${p.id}`}
                      className="product-card group block bg-white rounded-[16px] overflow-hidden border border-[#E5E5E3] hover:border-[#111] card-lift"
                      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.05)" }}>
                      <div className="relative h-44 overflow-hidden bg-[#F2F2F0]">
                        <img src={p.img} alt={p.name} className="img-main w-full h-full object-cover" />
                        <img src={p.img2} alt={p.name} className="img-hover w-full h-full object-cover" />
                        <span className={`absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-1">{p.type}</p>
                        <h3 className="text-[14px] font-semibold text-[#111] mb-2 leading-snug group-hover:text-[#E53935] transition-colors">{p.name}</h3>
                        <div className="flex gap-3 text-xs text-[#9CA3AF] mb-3"><span>{p.area} м²</span><span>{p.dims}</span></div>
                        <div className="flex items-center justify-between border-t border-[#F2F2F0] pt-2.5">
                          <p className="text-[16px] font-bold text-[#111]">от {fmt(p.price)}</p>
                          <span className="text-xs font-medium text-[#E53935] flex items-center gap-1">Расчёт <Icon name="ArrowRight" size={12} /></span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
