import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

/* ── Images ── */
const IMG_HERO = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/d86fb1b0-7b22-4cec-b1da-3a3216512f7a.jpg";
const IMG_SAUNA = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/639f572d-7ef2-4db5-a189-84ac4c9cadfe.jpg";
const IMG_INTERIOR = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/cbb14e09-7150-40dd-9492-1b7967e0ad27.jpg";
const IMG_FACTORY = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/2ba009f3-456b-4910-bf53-ad0b06374dce.jpg";
const IMG_PRODUCT = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/921f3008-7ef0-4113-9f74-dc48c87d7ccc.jpg";
const IMG_CABIN = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/f7142cb7-a7a3-4830-b4c0-37d7d57b5d57.jpg";

/* ── Types ── */
type BadgeType = "hit" | "available" | "winter" | "fast" | "popular";

interface Product {
  id: string; name: string; type: string; area: number; dims: string;
  price: number; badge?: BadgeType; tags: string[];
  img: string; img2: string; task: string;
}

/* ── Data ── */
const BADGE_MAP: Record<BadgeType, { label: string; cls: string }> = {
  hit: { label: "ХИТ", cls: "bg-[#E53935] text-white" },
  available: { label: "В наличии", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  winter: { label: "Можно жить зимой", cls: "bg-blue-50 text-blue-700 border border-blue-200" },
  fast: { label: "Доставка 3 дня", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  popular: { label: "Популярное", cls: "bg-violet-50 text-violet-700 border border-violet-200" },
};

const PRODUCTS: Product[] = [
  { id: "1", name: "Бытовка строительная", type: "Бытовка", area: 14, dims: "6×2.4 м", price: 189000, badge: "hit", tags: ["Металлокаркас", "Электрика", "Утепление"], img: IMG_PRODUCT, img2: IMG_FACTORY, task: "workers" },
  { id: "2", name: "Бытовка с тамбуром", type: "Бытовка", area: 18, dims: "6×3 м", price: 245000, badge: "available", tags: ["Тамбур", "Утеплённый пол", "220В"], img: IMG_PRODUCT, img2: IMG_INTERIOR, task: "workers" },
  { id: "3", name: "Дачный домик с террасой", type: "Дачный домик", area: 24, dims: "6×4 м", price: 420000, badge: "winter", tags: ["Терраса", "Утепление 150мм", "Санузел"], img: IMG_HERO, img2: IMG_CABIN, task: "dacha" },
  { id: "4", name: "Блок-контейнер офис", type: "Блок-контейнер", area: 14, dims: "6×2.4 м", price: 320000, badge: "fast", tags: ["Вентиляция", "Двойные двери", "Освещение"], img: IMG_PRODUCT, img2: IMG_FACTORY, task: "workers" },
  { id: "5", name: "Хостблок на 4 места", type: "Хостблок", area: 18, dims: "6×3 м", price: 480000, badge: "popular", tags: ["4 места", "Санузел", "Электрика"], img: IMG_CABIN, img2: IMG_INTERIOR, task: "rent" },
  { id: "6", name: "Хостблок на 8 мест", type: "Хостблок", area: 36, dims: "12×3 м", price: 890000, badge: "winter", tags: ["8 мест", "2 санузла", "Утепление 150мм"], img: IMG_CABIN, img2: IMG_HERO, task: "rent" },
  { id: "7", name: "Баня на металлокаркасе", type: "Баня", area: 18, dims: "3×6 м", price: 360000, badge: "hit", tags: ["Вагонка", "Печь", "Предбанник"], img: IMG_SAUNA, img2: IMG_INTERIOR, task: "sauna" },
  { id: "8", name: "Баня с комнатой отдыха", type: "Баня", area: 24, dims: "4×6 м", price: 490000, badge: "winter", tags: ["Комната отдыха", "Утепление 150мм", "Веранда"], img: IMG_SAUNA, img2: IMG_CABIN, task: "sauna" },
  { id: "9", name: "Хозблок для дачи", type: "Хозблок", area: 9, dims: "3×3 м", price: 95000, badge: "fast", tags: ["Металлопрофиль", "Ворота", "Полки"], img: IMG_PRODUCT, img2: IMG_FACTORY, task: "hozblok" },
  { id: "10", name: "Дом для круглогодичного жилья", type: "Дачный домик", area: 36, dims: "6×6 м", price: 780000, badge: "winter", tags: ["Утепление 200мм", "Тёплый пол", "-40°C"], img: IMG_HERO, img2: IMG_INTERIOR, task: "living" },
  { id: "11", name: "Мобильный офис 3×6", type: "Блок-контейнер", area: 18, dims: "3×6 м", price: 290000, badge: "available", tags: ["Окна", "Кондиционер", "Розетки"], img: IMG_PRODUCT, img2: IMG_FACTORY, task: "workers" },
  { id: "12", name: "Модульный гараж", type: "Хозблок", area: 24, dims: "4×6 м", price: 210000, badge: "popular", tags: ["Ворота 3м", "Освещение", "Полки"], img: IMG_PRODUCT, img2: IMG_FACTORY, task: "hozblok" },
];

const TASK_FILTERS = [
  { id: "all", label: "Все" },
  { id: "dacha", label: "Для дачи" },
  { id: "workers", label: "Для рабочих" },
  { id: "living", label: "Для проживания" },
  { id: "sauna", label: "Баня" },
  { id: "rent", label: "Под сдачу" },
  { id: "hozblok", label: "Хозблок" },
];

const TASK_CARDS = [
  { id: "dacha", icon: "Sun", label: "Для дачи", desc: "Лёгкие, комфортные домики для загородного отдыха" },
  { id: "living", icon: "Home", label: "Для проживания", desc: "Утеплённые дома для круглогодичного жилья" },
  { id: "workers", icon: "HardHat", label: "Для стройки", desc: "Бытовки и блок-контейнеры для строительных бригад" },
  { id: "rent", icon: "Users", label: "Под сдачу", desc: "Хостблоки и домики для сдачи в аренду" },
  { id: "sauna", icon: "Flame", label: "Баня", desc: "Бани на металлокаркасе с утеплением для зимы" },
  { id: "hozblok", icon: "Box", label: "Хозблок", desc: "Компактные хозблоки и гаражи для участка" },
];

const WHY = [
  { icon: "Factory", title: "Собственное производство", desc: "Делаем сами — без посредников. Полный контроль качества." },
  { icon: "Truck", title: "Доставка манипулятором", desc: "Привезём и поставим за 1 день по всей России." },
  { icon: "FileText", title: "Договор с гарантией", desc: "Работаем официально. Гарантия 1 год на конструкцию." },
  { icon: "Camera", title: "Фотоотчёты с производства", desc: "Фото и видео каждого этапа — всё прозрачно." },
  { icon: "Thermometer", title: "Утепление для зимы", desc: "Минвата 100–200 мм. Комфортно при −40°C." },
  { icon: "Sliders", title: "Любая кастомизация", desc: "Ваш размер, отделка и планировка — под задачу." },
];

const STEPS = [
  { n: "01", title: "Оставляете заявку", desc: "Звоните или пишите. Ответим за 15 минут.", icon: "MessageSquare" },
  { n: "02", title: "Согласовываем проект", desc: "Рассчитываем стоимость, уточняем детали и сроки.", icon: "Calculator" },
  { n: "03", title: "Производим", desc: "Строим на заводе. Отправляем фото с производства.", icon: "Wrench" },
  { n: "04", title: "Доставляем и устанавливаем", desc: "Манипулятором привезём и поставим на место за 1 день.", icon: "Truck" },
];

/* ── Helpers ── */
function fmt(n: number) {
  if (n >= 1000000) return `${(n/1000000).toFixed(n%1000000===0?0:1)} млн ₽`;
  return `${(n/1000).toFixed(0)} тыс ₽`;
}

/* ── Mini Configurator ── */
function Configurator() {
  const [form, setForm] = useState({ type: "", size: "", insulation: "", budget: "", address: "", contact: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await api.createOrder({ name: "Конфигуратор", phone: form.contact, message: `Тип: ${form.type}, Размер: ${form.size}, Утепление: ${form.insulation}, Бюджет: ${form.budget}, Адрес: ${form.address}` });
    setLoading(false);
    setSent(true);
  };

  if (sent) return (
    <div className="bg-white rounded-[24px] p-8 card-shadow text-center">
      <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
        <Icon name="CheckCircle" size={28} className="text-emerald-600" />
      </div>
      <p className="font-semibold text-[#111] text-lg mb-1">Заявка отправлена!</p>
      <p className="text-[#6B7280] text-sm">Свяжемся в течение 15 минут</p>
    </div>
  );

  const sel = "w-full h-10 rounded-lg border border-[#E5E5E3] bg-white px-3 text-sm text-[#111] focus:outline-none focus:border-[#E53935] transition-colors appearance-none cursor-pointer";

  return (
    <div className="bg-white rounded-[24px] p-6 card-shadow">
      <div className="mb-5">
        <p className="text-xs text-[#E53935] font-semibold uppercase tracking-wider mb-1">Быстрый расчёт</p>
        <h3 className="text-lg font-bold text-[#111] leading-snug">Получите расчёт за 15 минут</h3>
        <p className="text-[#6B7280] text-sm mt-1">Настройте параметры — мы подберём лучшее решение</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-xs text-[#6B7280] mb-1 block">Тип строения</label>
            <div className="relative">
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className={sel}>
                <option value="">Выбрать</option>
                <option>Бытовка</option><option>Дачный домик</option>
                <option>Баня</option><option>Хостблок</option><option>Хозблок</option>
              </select>
              <Icon name="ChevronDown" size={14} className="absolute right-2.5 top-3 text-[#9CA3AF] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-[#6B7280] mb-1 block">Размер</label>
            <div className="relative">
              <select value={form.size} onChange={e => setForm({...form, size: e.target.value})} className={sel}>
                <option value="">Выбрать</option>
                <option>3×6 м</option><option>6×3 м</option><option>6×4 м</option>
                <option>6×6 м</option><option>Другой</option>
              </select>
              <Icon name="ChevronDown" size={14} className="absolute right-2.5 top-3 text-[#9CA3AF] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-[#6B7280] mb-1 block">Утепление</label>
            <div className="relative">
              <select value={form.insulation} onChange={e => setForm({...form, insulation: e.target.value})} className={sel}>
                <option value="">Выбрать</option>
                <option>Без утепления</option><option>100 мм (осень)</option>
                <option>150 мм (зима)</option><option>200 мм (Сибирь)</option>
              </select>
              <Icon name="ChevronDown" size={14} className="absolute right-2.5 top-3 text-[#9CA3AF] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-[#6B7280] mb-1 block">Бюджет</label>
            <div className="relative">
              <select value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} className={sel}>
                <option value="">Выбрать</option>
                <option>до 200 тыс</option><option>200–400 тыс</option>
                <option>400–700 тыс</option><option>от 700 тыс</option>
              </select>
              <Icon name="ChevronDown" size={14} className="absolute right-2.5 top-3 text-[#9CA3AF] pointer-events-none" />
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs text-[#6B7280] mb-1 block">Адрес доставки</label>
          <input value={form.address} onChange={e => setForm({...form, address: e.target.value})}
            placeholder="Город, регион" className="w-full h-10 rounded-lg border border-[#E5E5E3] px-3 text-sm text-[#111] focus:outline-none focus:border-[#E53935] transition-colors" />
        </div>
        <div>
          <label className="text-xs text-[#6B7280] mb-1 block">Telegram или WhatsApp</label>
          <input value={form.contact} onChange={e => setForm({...form, contact: e.target.value})}
            placeholder="+7 900 000-00-00 или @username" required
            className="w-full h-10 rounded-lg border border-[#E5E5E3] px-3 text-sm text-[#111] focus:outline-none focus:border-[#E53935] transition-colors" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full h-11 rounded-[10px] bg-[#E53935] hover:bg-[#C62828] text-white text-sm font-semibold transition-all duration-200 hover:shadow-[0_4px_16px_rgba(229,57,53,0.3)] active:scale-[0.98]">
          {loading ? "Отправляем..." : "Получить расчёт за 15 минут"}
        </button>
        <p className="text-center text-[#9CA3AF] text-xs">Без спама · Ответим за 15 минут</p>
      </form>
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ p }: { p: Product }) {
  const badge = p.badge ? BADGE_MAP[p.badge] : null;
  return (
    <Link to={`/properties/${p.id}`} className="product-card group block bg-white rounded-[16px] overflow-hidden card-shadow card-lift" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}>
      <div className="relative h-48 overflow-hidden bg-[#F2F2F0]">
        <img src={p.img} alt={p.name} className="img-main w-full h-full object-cover" />
        <img src={p.img2} alt={p.name} className="img-hover w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        {badge && (
          <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider mb-1">{p.type}</p>
        <h3 className="text-[15px] font-semibold text-[#111] mb-2 leading-snug group-hover:text-[#E53935] transition-colors">{p.name}</h3>
        <div className="flex items-center gap-3 text-[#6B7280] text-xs mb-3">
          <span className="flex items-center gap-1"><Icon name="Maximize2" size={11} />{p.area} м²</span>
          <span className="flex items-center gap-1"><Icon name="Ruler" size={11} />{p.dims}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {p.tags.map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-[#F7F7F5] text-[#6B7280] border border-[#E5E5E3]">{t}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-[#F2F2F0]">
          <div>
            <p className="text-[11px] text-[#9CA3AF]">от</p>
            <p className="text-[17px] font-bold text-[#111]">{fmt(p.price)}</p>
          </div>
          <span className="text-xs font-medium text-[#E53935] flex items-center gap-1 group-hover:gap-2 transition-all">
            Расчёт <Icon name="ArrowRight" size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Main ── */
export default function HomePage() {
  const [activeTask, setActiveTask] = useState("all");

  const filtered = activeTask === "all" ? PRODUCTS : PRODUCTS.filter(p => p.task === activeTask);

  return (
    <div style={{ background: "#F7F7F5" }}>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden" style={{ background: "#F7F7F5" }}>
        <div className="container py-14 md:py-20">
          <div className="grid lg:grid-cols-[1fr_420px] gap-10 xl:gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-[#6B7280] mb-6 px-3 py-1.5 rounded-full border border-[#E5E5E3] bg-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Производство и доставка по всей России
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-[56px] font-bold text-[#111] leading-[1.1] tracking-tight mb-5">
                Модульные дома,<br />бытовки и бани<br />
                <span style={{ color: "#E53935" }}>напрямую</span> от производства
              </h1>
              <p className="text-[#6B7280] text-lg mb-8 max-w-lg leading-relaxed">
                Изготовление от 7 дней. Доставка по всей России. Работаем по договору с гарантией 1 год.
              </p>

              {/* Micro stats */}
              <div className="flex flex-wrap gap-6 mb-10">
                {[
                  { val: "500+", label: "объектов" },
                  { val: "7 дней", label: "производство" },
                  { val: "1 год", label: "гарантия" },
                  { val: "по РФ", label: "доставка" },
                ].map(s => (
                  <div key={s.val}>
                    <p className="text-2xl font-bold text-[#111]">{s.val}</p>
                    <p className="text-xs text-[#9CA3AF]">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/properties">
                  <button className="h-12 px-7 rounded-[10px] bg-[#111] hover:bg-[#222] text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg active:scale-[0.98] flex items-center gap-2">
                    <Icon name="Grid3x3" size={15} />
                    Смотреть каталог
                  </button>
                </Link>
                <a href="#calc">
                  <button className="h-12 px-7 rounded-[10px] bg-white border border-[#E5E5E3] text-[#111] text-sm font-semibold transition-all duration-200 hover:border-[#111] hover:shadow-md active:scale-[0.98] flex items-center gap-2">
                    <Icon name="Calculator" size={15} />
                    Получить расчёт
                  </button>
                </a>
              </div>
            </div>

            {/* Right: Configurator */}
            <div className="w-full">
              <Configurator />
            </div>
          </div>
        </div>

        {/* Hero image strip */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img src={IMG_HERO} alt="Модульный дом" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F7F5] via-transparent to-transparent" style={{ background: "linear-gradient(90deg, #F7F7F5 0%, transparent 30%, transparent 70%, #F7F7F5 100%)" }} />
        </div>
      </section>

      {/* ===== CATALOG ===== */}
      <section className="py-16 md:py-20" style={{ background: "#F7F7F5" }}>
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
            <div>
              <p className="text-xs font-semibold text-[#E53935] uppercase tracking-wider mb-2">Каталог</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111]">Готовые модели</h2>
              <p className="text-[#6B7280] mt-1.5">Выберите модель — рассчитаем под ваши задачи</p>
            </div>
            <Link to="/properties" className="text-sm font-medium text-[#111] flex items-center gap-1.5 hover:gap-2.5 transition-all border-b border-[#111] pb-0.5 self-start md:self-auto">
              Весь каталог <Icon name="ArrowRight" size={14} />
            </Link>
          </div>

          {/* Task filters */}
          <div className="flex gap-2 flex-wrap mb-8">
            {TASK_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveTask(f.id)}
                className={`h-9 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTask === f.id
                    ? "bg-[#111] text-white"
                    : "bg-white text-[#6B7280] border border-[#E5E5E3] hover:border-[#111] hover:text-[#111]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid 4-col */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(p => <ProductCard key={p.id} p={p} />)}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#9CA3AF]">Нет моделей для этой задачи</div>
          )}
        </div>
      </section>

      {/* ===== TASK CARDS ===== */}
      <section className="py-16" style={{ background: "#fff" }}>
        <div className="container">
          <div className="mb-10">
            <p className="text-xs font-semibold text-[#E53935] uppercase tracking-wider mb-2">Подбор</p>
            <h2 className="text-3xl font-bold text-[#111]">Подберём под вашу задачу</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {TASK_CARDS.map(t => (
              <button
                key={t.id}
                onClick={() => { setActiveTask(t.id); document.querySelector("#catalog-section")?.scrollIntoView({ behavior: "smooth" }); window.scrollTo({ top: 500, behavior: "smooth" }); }}
                className="group text-left p-4 rounded-[16px] bg-[#F7F7F5] hover:bg-[#111] border border-[#E5E5E3] hover:border-[#111] transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors">
                  <Icon name={t.icon} size={20} className="text-[#E53935] group-hover:text-white transition-colors" />
                </div>
                <p className="text-sm font-semibold text-[#111] group-hover:text-white transition-colors mb-1">{t.label}</p>
                <p className="text-xs text-[#9CA3AF] group-hover:text-white/60 transition-colors leading-snug">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY ===== */}
      <section className="py-16 md:py-20" style={{ background: "#F7F7F5" }}>
        <div className="container">
          <div className="mb-12">
            <p className="text-xs font-semibold text-[#E53935] uppercase tracking-wider mb-2">Преимущества</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111]">Почему выбирают нас</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY.map((w) => (
              <div key={w.title} className="bg-white rounded-[16px] p-6 border border-[#E5E5E3] hover:border-[#111] group transition-all duration-200 hover:shadow-card-hover card-lift">
                <div className="w-11 h-11 rounded-xl bg-[#F7F7F5] flex items-center justify-center mb-4 group-hover:bg-[#E53935] transition-colors duration-200">
                  <Icon name={w.icon} size={20} className="text-[#E53935] group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="font-semibold text-[#111] mb-1.5 text-[15px]">{w.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW WE WORK ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
            <div>
              <p className="text-xs font-semibold text-[#E53935] uppercase tracking-wider mb-2">Процесс</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-10">Как мы работаем</h2>
              <div className="space-y-6">
                {STEPS.map((s, i) => (
                  <div key={s.n} className="flex gap-5 group">
                    <div className={`shrink-0 w-12 h-12 rounded-[14px] flex items-center justify-center font-bold text-sm transition-all duration-200 ${i === 0 ? "bg-[#E53935] text-white" : "bg-[#F7F7F5] text-[#9CA3AF] group-hover:bg-[#111] group-hover:text-white"}`}>
                      {s.n}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#111] mb-1">{s.title}</h3>
                      <p className="text-[#6B7280] text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <img src={IMG_FACTORY} alt="Производство" className="rounded-[16px] h-48 w-full object-cover" />
                <img src={IMG_CABIN} alt="Доставка" className="rounded-[16px] h-48 w-full object-cover" />
              </div>
              <img src={IMG_HERO} alt="Установка" className="rounded-[16px] h-56 w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section className="py-16" style={{ background: "#F7F7F5" }}>
        <div className="container">
          <div className="mb-10">
            <p className="text-xs font-semibold text-[#E53935] uppercase tracking-wider mb-2">Галерея</p>
            <h2 className="text-3xl font-bold text-[#111]">Жизнь в наших строениях</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 md:row-span-2 rounded-[16px] overflow-hidden">
              <img src={IMG_HERO} alt="Дом" className="w-full h-full object-cover" style={{ minHeight: 280 }} />
            </div>
            {[IMG_SAUNA, IMG_INTERIOR, IMG_CABIN].map((src, i) => (
              <div key={i} className="rounded-[16px] overflow-hidden h-36 md:h-auto">
                <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA / FORM ===== */}
      <section id="calc" className="py-16 md:py-24" style={{ background: "#111" }}>
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Получите расчёт бесплатно за 15 минут
              </h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Опишите задачу — мы подберём модель, рассчитаем стоимость и ответим на все вопросы.
              </p>
              <div className="space-y-3">
                {["Расчёт — бесплатно и без обязательств", "Работаем по всей России", "Договор и гарантия 1 год"].map(t => (
                  <div key={t} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E53935]/20 flex items-center justify-center shrink-0">
                      <Icon name="Check" size={11} className="text-[#E53935]" />
                    </div>
                    <span className="text-white/80 text-sm">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <Configurator />
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 pb-4 pt-2 bg-white border-t border-[#E5E5E3]">
        <a href="#calc">
          <button className="w-full h-12 rounded-[10px] bg-[#E53935] text-white text-sm font-semibold flex items-center justify-center gap-2">
            <Icon name="Calculator" size={16} />
            Получить расчёт
          </button>
        </a>
      </div>

    </div>
  );
}
