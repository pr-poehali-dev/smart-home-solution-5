import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const A_HOUSE   = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/09435458-b956-4ef3-98d7-97b4a80e7199.jpg";
const A_FACTORY = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/d100c3ce-b7df-433e-b1e2-fd8431b216de.jpg";
const A_SAUNA   = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/380c4527-1e9c-478e-9093-5767a6151a23.jpg";
const A_CABIN   = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/f7142cb7-a7a3-4830-b4c0-37d7d57b5d57.jpg";
const A_INT     = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/cbb14e09-7150-40dd-9492-1b7967e0ad27.jpg";
const A_PROD    = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/921f3008-7ef0-4113-9f74-dc48c87d7ccc.jpg";

type Badge = "ХИТ" | "В наличии" | "Зима ✓" | "Быстро" | "Популярное" | "Бюджетный" | "Под сдачу";

const BADGE_CLS: Record<Badge, string> = {
  "ХИТ":        "bg-[#E53935] text-white",
  "В наличии":  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Зима ✓":     "bg-blue-50 text-blue-700 border border-blue-200",
  "Быстро":     "bg-amber-50 text-amber-700 border border-amber-200",
  "Популярное": "bg-violet-50 text-violet-700 border border-violet-200",
  "Бюджетный":  "bg-g100 text-g600 border border-g200",
  "Под сдачу":  "bg-teal-50 text-teal-700 border border-teal-200",
};

const ALL = [
  { id:"1",  name:"Бытовка строительная",    type:"Бытовка",        area:14, dims:"6×2.4 м",  price:189000, badge:"ХИТ"        as Badge, img:A_PROD,  img2:A_FACTORY },
  { id:"2",  name:"Бытовка с тамбуром",      type:"Бытовка",        area:18, dims:"6×3 м",    price:245000, badge:"В наличии"  as Badge, img:A_PROD,  img2:A_INT     },
  { id:"3",  name:"Дачный домик с террасой", type:"Дачный домик",   area:24, dims:"6×4 м",    price:420000, badge:"Зима ✓"    as Badge, img:A_HOUSE, img2:A_CABIN   },
  { id:"4",  name:"Блок-контейнер офис",     type:"Блок-контейнер", area:14, dims:"6×2.4 м",  price:320000, badge:"Быстро"    as Badge, img:A_PROD,  img2:A_FACTORY },
  { id:"5",  name:"Хостблок на 4 места",     type:"Хостблок",       area:18, dims:"6×3 м",    price:480000, badge:"Популярное"as Badge, img:A_CABIN, img2:A_INT     },
  { id:"6",  name:"Хостблок на 8 мест",      type:"Хостблок",       area:36, dims:"12×3 м",   price:890000, badge:"Под сдачу" as Badge, img:A_CABIN, img2:A_HOUSE   },
  { id:"7",  name:"Баня на металлокаркасе",  type:"Баня",           area:18, dims:"3×6 м",    price:360000, badge:"ХИТ"       as Badge, img:A_SAUNA, img2:A_INT     },
  { id:"8",  name:"Баня с комнатой отдыха",  type:"Баня",           area:24, dims:"4×6 м",    price:490000, badge:"Зима ✓"   as Badge, img:A_SAUNA, img2:A_CABIN   },
  { id:"9",  name:"Хозблок для дачи",        type:"Хозблок",        area:9,  dims:"3×3 м",    price:95000,  badge:"Бюджетный"as Badge, img:A_PROD,  img2:A_FACTORY },
  { id:"10", name:"Дом для круглогодичного проживания", type:"Дачный домик", area:36, dims:"6×6 м", price:780000, badge:"Зима ✓" as Badge, img:A_HOUSE, img2:A_INT },
  { id:"11", name:"Мобильный офис 3×6",      type:"Блок-контейнер", area:18, dims:"3×6 м",    price:290000, badge:"В наличии" as Badge, img:A_PROD,  img2:A_FACTORY },
  { id:"12", name:"Модульный гараж",         type:"Хозблок",        area:24, dims:"4×6 м",    price:210000, badge:"Популярное"as Badge, img:A_PROD,  img2:A_FACTORY },
];

const TYPES = ["Все", "Бытовка", "Дачный домик", "Баня", "Хостблок", "Блок-контейнер", "Хозблок"];

function fmt(n: number) {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)} млн ₽`;
  return `${Math.round(n/1000)} тыс ₽`;
}

export default function PropertiesPage() {
  const [type, setType]       = useState("Все");
  const [maxP, setMaxP]       = useState(1000000);
  const [asc,  setAsc]        = useState(true);

  const list = ALL
    .filter(p => type === "Все" || p.type === type)
    .filter(p => p.price <= maxP)
    .sort((a, b) => asc ? a.price - b.price : b.price - a.price);

  return (
    <div className="bg-white min-h-screen">

      {/* page header */}
      <section className="border-b border-g200 py-12 bg-g50">
        <div className="container">
          <p className="text-xs font-semibold text-[#E53935] uppercase tracking-widest mb-2">Каталог</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-ink mb-2">Модульные строения</h1>
          <p className="text-g600">Бытовки, домики, бани, хостблоки и хозблоки — собственного производства</p>

          {/* type tabs */}
          <div className="flex flex-wrap gap-2 mt-8">
            {TYPES.map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`h-8 px-4 rounded-full text-sm font-medium transition-colors border
                  ${type === t ? "bg-ink text-white border-ink" : "bg-white text-g600 border-g200 hover:border-ink hover:text-ink"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-10">
        <div className="grid lg:grid-cols-[220px_1fr] gap-8">

          {/* sidebar */}
          <aside className="hidden lg:flex flex-col gap-5">
            <div className="bg-white rounded-xl border border-g200 p-5">
              <h3 className="text-sm font-semibold text-ink mb-3">Бюджет до</h3>
              <p className="text-xl font-bold text-ink mb-3">{fmt(maxP)}</p>
              <input type="range" min={50000} max={1000000} step={25000}
                value={maxP} onChange={e => setMaxP(+e.target.value)}
                className="w-full accent-[#E53935] cursor-pointer" />
              <div className="flex justify-between text-xs text-g400 mt-1"><span>50 тыс</span><span>1 млн</span></div>
            </div>

            <div className="bg-white rounded-xl border border-g200 p-5">
              <h3 className="text-sm font-semibold text-ink mb-3">Сортировка</h3>
              {[{ v:true,  l:"Сначала дешевле" }, { v:false, l:"Сначала дороже" }].map(s => (
                <button key={String(s.v)} onClick={() => setAsc(s.v)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors
                    ${asc === s.v ? "bg-ink text-white font-medium" : "text-g600 hover:bg-g50"}`}>
                  {s.l}
                </button>
              ))}
            </div>

            <div className="rounded-xl p-5 bg-[#fff5f5] border border-[#E53935]/15">
              <p className="text-sm font-semibold text-ink mb-1">Нужна консультация?</p>
              <p className="text-xs text-g600 mb-3 leading-relaxed">Подберём под бюджет и задачу</p>
              <a href="#calc"
                className="block w-full text-center h-9 leading-9 rounded-xl bg-[#E53935] text-white text-xs font-semibold hover:bg-[#C62828] transition-colors">
                Бесплатно
              </a>
            </div>
          </aside>

          {/* grid */}
          <div>
            <p className="text-sm text-g400 mb-5">{list.length} моделей</p>
            {list.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="PackageX" size={40} className="text-g200 mx-auto mb-3" />
                <p className="text-g600">Нет моделей по выбранным фильтрам</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {list.map(p => {
                  const bcls = BADGE_CLS[p.badge];
                  return (
                    <Link key={p.id} to={`/properties/${p.id}`}
                      className="group block bg-white rounded-2xl overflow-hidden border border-g200 hover:border-ink hover-lift">
                      <div className="img-wrap h-48 bg-g100">
                        <img src={p.img}  alt={p.name} className="img-a w-full h-full object-cover" />
                        <img src={p.img2} alt=""       className="img-b" />
                        <span className={`absolute top-2.5 left-2.5 z-10 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${bcls}`}>
                          {p.badge}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] text-g400 uppercase tracking-wider mb-1">{p.type}</p>
                        <h3 className="text-[14px] font-semibold text-ink mb-2 leading-snug group-hover:text-[#E53935] transition-colors">{p.name}</h3>
                        <div className="flex gap-3 text-xs text-g400 mb-3">
                          <span>{p.area} м²</span><span>{p.dims}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-g100 pt-3">
                          <span className="text-[16px] font-bold text-ink">от {fmt(p.price)}</span>
                          <span className="text-xs font-medium text-g600 group-hover:text-ink flex items-center gap-1 transition-colors">
                            Расчёт <Icon name="ArrowRight" size={12} />
                          </span>
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
