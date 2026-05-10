import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

const A_HOUSE   = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/09435458-b956-4ef3-98d7-97b4a80e7199.jpg";
const A_FACTORY = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/d100c3ce-b7df-433e-b1e2-fd8431b216de.jpg";
const A_SAUNA   = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/380c4527-1e9c-478e-9093-5767a6151a23.jpg";
const A_CABIN   = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/f7142cb7-a7a3-4830-b4c0-37d7d57b5d57.jpg";
const A_INT     = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/cbb14e09-7150-40dd-9492-1b7967e0ad27.jpg";
const A_PROD    = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/921f3008-7ef0-4113-9f74-dc48c87d7ccc.jpg";

const DB: Record<string, {
  name:string; type:string; price:number; area:number; dims:string;
  desc:string; specs:{k:string;v:string}[]; imgs:string[];
}> = {
  "1": { name:"Бытовка строительная", type:"Бытовка", price:189000, area:14, dims:"6×2.4×2.5 м",
    desc:"Классическая строительная бытовка на металлокаркасе 80×80 мм. Утеплена минватой 100 мм — тепло при заморозках. Металлопрофиль снаружи, вагонка внутри. Электрика 220В, освещение, двойная дверь.",
    specs:[{k:"Каркас",v:"Металл 80×80 мм"},{k:"Утепление",v:"Минвата 100 мм"},{k:"Наружная обшивка",v:"Металлопрофиль"},{k:"Внутренняя отделка",v:"Вагонка"},{k:"Электрика",v:"220В, розетки, свет"},{k:"Срок изготовления",v:"7–10 дней"},{k:"Гарантия",v:"1 год"}],
    imgs:[A_PROD,A_FACTORY,A_INT,A_HOUSE] },
  "2": { name:"Бытовка с тамбуром", type:"Бытовка", price:245000, area:18, dims:"6×3×2.5 м",
    desc:"Бытовка с утеплённым тамбуром — меньше теплопотерь, удобный вход. Минвата 100 мм, металлосайдинг, утеплённый пол. Электрика 220В, конвекторы.",
    specs:[{k:"Тамбур",v:"Утеплённый"},{k:"Утепление",v:"Минвата 100 мм"},{k:"Пол",v:"Утеплённый"},{k:"Электрика",v:"220В"},{k:"Срок",v:"7–10 дней"},{k:"Гарантия",v:"1 год"}],
    imgs:[A_PROD,A_INT,A_FACTORY,A_CABIN] },
  "3": { name:"Дачный домик с террасой", type:"Дачный домик", price:420000, area:24, dims:"6×4×3 м",
    desc:"Уютный дачный домик с открытой террасой. Утепление 150 мм — комфортно до −30°C. Металлосайдинг снаружи, вагонка внутри. Санузел, большие окна, конвекторный обогрев.",
    specs:[{k:"Терраса",v:"Включена"},{k:"Утепление",v:"Минвата 150 мм"},{k:"Санузел",v:"Есть"},{k:"Окна",v:"ПВХ, двойной стеклопакет"},{k:"Комфорт зимой",v:"до −30°C"},{k:"Гарантия",v:"1 год"}],
    imgs:[A_HOUSE,A_CABIN,A_INT,A_FACTORY] },
  "6": { name:"Хостблок на 8 мест", type:"Хостблок", price:890000, area:36, dims:"12×3×2.7 м",
    desc:"Хостблок на 8 спальных мест для строительных бригад или сдачи в аренду. 4 двухъярусные кровати, 2 санузла, электрика 220В. Утепление 150 мм, металлокаркас 80×80 мм.",
    specs:[{k:"Спальные места",v:"8"},{k:"Санузлы",v:"2"},{k:"Утепление",v:"Минвата 150 мм"},{k:"Каркас",v:"Металл 80×80 мм"},{k:"Электрика",v:"220В"},{k:"Гарантия",v:"1 год"}],
    imgs:[A_CABIN,A_HOUSE,A_INT,A_FACTORY] },
  "7": { name:"Баня на металлокаркасе", type:"Баня", price:360000, area:18, dims:"3×6×2.8 м",
    desc:"Баня с парной, помывочной и предбанником. Вагонка из натурального дерева внутри. Утепление 150 мм — баня быстро набирает жар и долго держит. Металлосайдинг снаружи.",
    specs:[{k:"Парная",v:"Есть"},{k:"Предбанник",v:"Есть"},{k:"Утепление",v:"Минвата 150 мм"},{k:"Внутренняя отделка",v:"Вагонка"},{k:"Срок",v:"10–14 дней"},{k:"Гарантия",v:"1 год"}],
    imgs:[A_SAUNA,A_INT,A_CABIN,A_FACTORY] },
};

function fmt(n: number) {
  return new Intl.NumberFormat("ru-RU",{style:"currency",currency:"RUB",maximumFractionDigits:0}).format(n);
}

export default function PropertyDetailPage() {
  const { id } = useParams<{id:string}>();
  const item = DB[id || "1"] || DB["1"];

  const [activeImg, setActiveImg] = useState(0);
  const [full,      setFull]      = useState(false);
  const [name,      setName]      = useState("");
  const [phone,     setPhone]     = useState("");
  const [msg,       setMsg]       = useState("");
  const [sent,      setSent]      = useState(false);
  const [busy,      setBusy]      = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await api.createOrder({ name, phone, message: msg, product_name: item.name });
    setBusy(false);
    setSent(true);
  };

  return (
    <div className="bg-white min-h-screen">

      {/* fullscreen overlay */}
      {full && (
        <div className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-6" onClick={() => setFull(false)}>
          <img src={item.imgs[activeImg]} alt="" className="max-w-full max-h-full rounded-xl object-contain" />
          <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <Icon name="X" size={18} />
          </button>
        </div>
      )}

      <div className="container py-10 md:py-14">

        {/* breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-g400 mb-10">
          <Link to="/"           className="hover:text-ink transition-colors">Главная</Link>
          <Icon name="ChevronRight" size={13} />
          <Link to="/properties" className="hover:text-ink transition-colors">Каталог</Link>
          <Icon name="ChevronRight" size={13} />
          <span className="text-g600">{item.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_360px] gap-12 xl:gap-16">

          {/* ── LEFT ── */}
          <div>
            {/* main image */}
            <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-g100 cursor-zoom-in mb-3"
              onClick={() => setFull(true)}>
              <img src={item.imgs[activeImg]} alt={item.name}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
            </div>

            {/* thumbs */}
            <div className="flex gap-2 mb-10">
              {item.imgs.map((src, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`flex-1 rounded-xl overflow-hidden aspect-video border-2 transition-all
                    ${activeImg === i ? "border-ink" : "border-transparent opacity-55 hover:opacity-80"}`}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* title block */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-[#E53935] uppercase tracking-widest mb-2">{item.type}</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{item.name}</h1>
              <div className="flex flex-wrap gap-5 text-sm text-g600 mb-5">
                <span className="flex items-center gap-1.5"><Icon name="Maximize2" size={14}/>{item.area} м²</span>
                <span className="flex items-center gap-1.5"><Icon name="Ruler"     size={14}/>{item.dims}</span>
                <span className="flex items-center gap-1.5"><Icon name="Clock"     size={14}/>от 7 дней</span>
                <span className="flex items-center gap-1.5"><Icon name="Shield"    size={14}/>Гарантия 1 год</span>
              </div>
              <p className="text-g600 leading-relaxed">{item.desc}</p>
            </div>

            {/* specs table */}
            <div className="rounded-2xl border border-g200 overflow-hidden mb-8">
              <div className="px-5 py-3.5 bg-g50 border-b border-g200">
                <h2 className="text-sm font-semibold text-ink">Характеристики</h2>
              </div>
              {item.specs.map((s, i) => (
                <div key={s.k}
                  className={`flex items-center justify-between px-5 py-3 ${i < item.specs.length-1 ? "border-b border-g100" : ""}`}>
                  <span className="text-sm text-g600">{s.k}</span>
                  <span className="text-sm font-medium text-ink">{s.v}</span>
                </div>
              ))}
            </div>

            {/* why us */}
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon:"Factory",     text:"Собственное производство без посредников" },
                { icon:"Truck",       text:"Доставка манипулятором по всей России" },
                { icon:"FileText",    text:"Официальный договор с гарантией 1 год" },
                { icon:"Camera",      text:"Фотоотчёты с каждого этапа производства" },
              ].map(w => (
                <div key={w.text} className="flex items-start gap-3 bg-g50 rounded-xl p-4 border border-g200">
                  <div className="w-8 h-8 rounded-lg bg-white border border-g200 flex items-center justify-center shrink-0">
                    <Icon name={w.icon} size={14} className="text-[#E53935]" />
                  </div>
                  <p className="text-sm text-g600 leading-snug">{w.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: sticky CTA ── */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl border border-g200 shadow-panel overflow-hidden">

              {/* price */}
              <div className="px-6 py-5 border-b border-g200">
                <p className="text-xs text-g400 mb-1">Стоимость</p>
                <p className="text-3xl font-extrabold text-ink">от {fmt(item.price)}</p>
                <p className="text-xs text-g400 mt-1">Точная цена — после расчёта</p>
              </div>

              {/* form */}
              <div className="p-6">
                {sent ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-3">
                      <Icon name="Check" size={24} className="text-emerald-600" />
                    </div>
                    <p className="font-semibold text-ink mb-1">Заявка принята!</p>
                    <p className="text-sm text-g600">Ответим в течение 15 минут</p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-3">
                    <h3 className="font-semibold text-ink mb-3">Получить расчёт</h3>
                    {[
                      { label:"Ваше имя",       val:name,  set:setName,  ph:"Александр",          req:false },
                      { label:"Телефон / Telegram", val:phone, set:setPhone, ph:"+7 900 000-00-00", req:true  },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block text-xs text-g600 mb-1">{f.label}</label>
                        <input value={f.val} onChange={e => f.set(e.target.value)}
                          placeholder={f.ph} required={f.req}
                          className="w-full h-10 rounded-xl border border-g200 px-3 text-sm text-ink focus:outline-none focus:border-ink transition-colors" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs text-g600 mb-1">Пожелания (необязательно)</label>
                      <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3}
                        placeholder="Размер, комплектация, адрес доставки…"
                        className="w-full rounded-xl border border-g200 px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-ink resize-none transition-colors" />
                    </div>
                    <button type="submit" disabled={busy}
                      className="w-full h-11 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white text-sm font-semibold transition-colors shadow-red disabled:opacity-60">
                      {busy ? "Отправляем…" : "Получить расчёт бесплатно"}
                    </button>
                    <p className="text-center text-g400 text-xs">Без спама. Ответим быстро.</p>
                  </form>
                )}
              </div>

              {/* phone */}
              <div className="px-6 pb-5 flex items-center gap-3 border-t border-g100 pt-4">
                <div className="w-9 h-9 rounded-full bg-g50 border border-g200 flex items-center justify-center shrink-0">
                  <Icon name="Phone" size={15} className="text-ink" />
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm">+7 (800) 000-00-00</p>
                  <p className="text-xs text-g400">Пн–Пт 9:00–18:00</p>
                </div>
              </div>
            </div>

            {/* messengers */}
            <div className="flex gap-2.5 mt-3">
              <a href="https://t.me/" target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-g200 text-ink text-sm font-medium hover:bg-g50 transition-colors">
                <Icon name="Send" size={14} /> Telegram
              </a>
              <a href="https://wa.me/" target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-g200 text-ink text-sm font-medium hover:bg-g50 transition-colors">
                <Icon name="MessageCircle" size={14} /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* related */}
        <div className="mt-16 pt-12 border-t border-g200">
          <h2 className="text-2xl font-extrabold text-ink mb-6">Похожие модели</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {Object.entries(DB).filter(([k]) => k !== id).slice(0,3).map(([k, p]) => (
              <Link key={k} to={`/properties/${k}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-g200 hover:border-ink hover-lift">
                <div className="h-36 overflow-hidden bg-g100">
                  <img src={p.imgs[0]} alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-g400 uppercase tracking-wider mb-1">{p.type}</p>
                  <h3 className="text-sm font-semibold text-ink group-hover:text-[#E53935] transition-colors mb-1">{p.name}</h3>
                  <p className="text-[15px] font-bold text-ink">от {fmt(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* mobile sticky */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden px-4 pb-4 pt-3 bg-white border-t border-g200">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <p className="text-[10px] text-g400">от</p>
            <p className="text-lg font-bold text-ink leading-none">{fmt(item.price)}</p>
          </div>
          <button onClick={() => document.querySelector("form")?.scrollIntoView({behavior:"smooth"})}
            className="flex-1 h-12 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white text-sm font-semibold transition-colors shadow-red">
            Получить расчёт бесплатно
          </button>
        </div>
      </div>
    </div>
  );
}
