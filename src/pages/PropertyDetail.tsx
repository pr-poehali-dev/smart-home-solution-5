import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

const IMG_HERO = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/d86fb1b0-7b22-4cec-b1da-3a3216512f7a.jpg";
const IMG_SAUNA = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/639f572d-7ef2-4db5-a189-84ac4c9cadfe.jpg";
const IMG_INT = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/cbb14e09-7150-40dd-9492-1b7967e0ad27.jpg";
const IMG_FACTORY = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/2ba009f3-456b-4910-bf53-ad0b06374dce.jpg";
const IMG_PROD = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/921f3008-7ef0-4113-9f74-dc48c87d7ccc.jpg";
const IMG_CABIN = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/f7142cb7-a7a3-4830-b4c0-37d7d57b5d57.jpg";

const CATALOG: Record<string, {
  name: string; type: string; price: number; area: number; dims: string;
  desc: string; specs: { k: string; v: string }[]; tags: string[]; imgs: string[];
}> = {
  "1": { name: "Бытовка строительная", type: "Бытовка", price: 189000, area: 14, dims: "6×2.4×2.5 м",
    desc: "Классическая строительная бытовка на металлокаркасе 80×80 мм. Утеплена минватой 100 мм — тепло при заморозках. Металлопрофиль снаружи, вагонка внутри. Электрика 220В, освещение. Изготовление 7–10 дней.",
    specs: [{ k: "Каркас", v: "Металл 80×80 мм" }, { k: "Утепление", v: "Минвата 100 мм" }, { k: "Обшивка", v: "Металлопрофиль / Вагонка" }, { k: "Электрика", v: "220В, розетки, свет" }, { k: "Срок изготовления", v: "7–10 дней" }, { k: "Гарантия", v: "1 год" }],
    tags: ["Металлокаркас", "Электрика", "Утепление 100мм", "Доставка по РФ"], imgs: [IMG_PROD, IMG_FACTORY, IMG_INT, IMG_HERO] },
  "2": { name: "Бытовка с тамбуром", type: "Бытовка", price: 245000, area: 18, dims: "6×3×2.5 м",
    desc: "Бытовка с утеплённым тамбуром — меньше теплопотерь, удобный вход. Минвата 100 мм, металлосайдинг, утеплённый пол. Электрика 220В.",
    specs: [{ k: "Тамбур", v: "Утеплённый вход" }, { k: "Утепление", v: "Минвата 100 мм" }, { k: "Пол", v: "Утеплённый" }, { k: "Электрика", v: "220В" }, { k: "Срок", v: "7–10 дней" }, { k: "Гарантия", v: "1 год" }],
    tags: ["Тамбур", "Утеплённый пол", "Электрика"], imgs: [IMG_PROD, IMG_INT, IMG_FACTORY, IMG_HERO] },
  "3": { name: "Дачный домик с террасой", type: "Дачный домик", price: 420000, area: 24, dims: "6×4×3 м",
    desc: "Уютный дачный домик с открытой террасой. Утепление 150 мм — комфортно до −30°C. Металлосайдинг снаружи, вагонка внутри. Санузел, большие окна.",
    specs: [{ k: "Терраса", v: "Включена" }, { k: "Утепление", v: "Минвата 150 мм" }, { k: "Санузел", v: "Есть" }, { k: "Окна", v: "Панорамные, ПВХ" }, { k: "Зима", v: "до −30°C" }, { k: "Гарантия", v: "1 год" }],
    tags: ["Терраса", "Санузел", "Утепление 150мм", "Зима"], imgs: [IMG_HERO, IMG_CABIN, IMG_INT, IMG_PROD] },
  "7": { name: "Баня на металлокаркасе", type: "Баня", price: 360000, area: 18, dims: "3×6×2.8 м",
    desc: "Баня на металлокаркасе с парной, предбанником и помывочной. Вагонка из натурального дерева внутри. Утепление 150 мм. Металлосайдинг снаружи.",
    specs: [{ k: "Парная", v: "Включена" }, { k: "Предбанник", v: "Есть" }, { k: "Утепление", v: "Минвата 150 мм" }, { k: "Отделка", v: "Вагонка" }, { k: "Срок", v: "10–14 дней" }, { k: "Гарантия", v: "1 год" }],
    tags: ["Парная", "Предбанник", "Вагонка", "Утепление"], imgs: [IMG_SAUNA, IMG_INT, IMG_CABIN, IMG_HERO] },
};

function fmt(n: number) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const item = CATALOG[id || "1"] || CATALOG["1"];

  const [activeImg, setActiveImg] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await api.createOrder({ name, phone, message: msg, product_name: item.name });
    setLoading(false);
    setSent(true);
  };

  return (
    <div style={{ background: "#F7F7F5" }} className="min-h-screen">

      {/* Fullscreen */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setFullscreen(false)}>
          <img src={item.imgs[activeImg]} alt="" className="max-w-full max-h-full rounded-xl object-contain" />
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
            <Icon name="X" size={18} />
          </button>
        </div>
      )}

      <div className="container py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#9CA3AF] mb-8">
          <Link to="/" className="hover:text-[#111] transition-colors">Главная</Link>
          <Icon name="ChevronRight" size={13} />
          <Link to="/properties" className="hover:text-[#111] transition-colors">Каталог</Link>
          <Icon name="ChevronRight" size={13} />
          <span className="text-[#6B7280]">{item.name}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10 xl:gap-16">
          {/* Left */}
          <div>
            {/* Gallery */}
            <div className="cursor-pointer rounded-[20px] overflow-hidden mb-3 bg-[#F2F2F0] aspect-[4/3]" onClick={() => setFullscreen(true)}>
              <img src={item.imgs[activeImg]} alt={item.name} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
            </div>
            <div className="flex gap-2.5 mb-8">
              {item.imgs.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`flex-1 rounded-[12px] overflow-hidden aspect-[4/3] border-2 transition-all duration-200 ${activeImg === i ? "border-[#111]" : "border-transparent opacity-60 hover:opacity-90"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Info */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#E53935] uppercase tracking-wider mb-2">{item.type}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#111] mb-4">{item.name}</h1>
              <div className="flex flex-wrap gap-5 text-sm text-[#6B7280] mb-5">
                <span className="flex items-center gap-1.5"><Icon name="Maximize2" size={14} />{item.area} м²</span>
                <span className="flex items-center gap-1.5"><Icon name="Ruler" size={14} />{item.dims}</span>
                <span className="flex items-center gap-1.5"><Icon name="Clock" size={14} />от 7 дней</span>
                <span className="flex items-center gap-1.5"><Icon name="Shield" size={14} />Гарантия 1 год</span>
              </div>
              <p className="text-[#6B7280] leading-relaxed">{item.desc}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {item.tags.map(t => (
                <span key={t} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-white border border-[#E5E5E3] text-[#6B7280]">
                  <Icon name="Check" size={12} className="text-[#E53935]" />{t}
                </span>
              ))}
            </div>

            {/* Specs */}
            <div className="bg-white rounded-[16px] border border-[#E5E5E3] overflow-hidden mb-8">
              <div className="px-5 py-4 border-b border-[#E5E5E3]">
                <h2 className="text-sm font-semibold text-[#111]">Характеристики</h2>
              </div>
              <div className="divide-y divide-[#F2F2F0]">
                {item.specs.map(s => (
                  <div key={s.k} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-[#6B7280]">{s.k}</span>
                    <span className="text-sm font-medium text-[#111]">{s.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why us compact */}
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: "Factory", text: "Собственное производство без посредников" },
                { icon: "Truck", text: "Доставка манипулятором по всей России" },
                { icon: "FileText", text: "Официальный договор с гарантией" },
                { icon: "Camera", text: "Фотоотчёты с каждого этапа производства" },
              ].map(w => (
                <div key={w.text} className="flex items-start gap-3 bg-white rounded-[12px] p-3.5 border border-[#E5E5E3]">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F7F5] flex items-center justify-center shrink-0">
                    <Icon name={w.icon} size={15} className="text-[#E53935]" />
                  </div>
                  <p className="text-sm text-[#6B7280] leading-snug">{w.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: CTA sticky */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-[20px] border border-[#E5E5E3] overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
              <div className="p-6 border-b border-[#E5E5E3]">
                <p className="text-xs text-[#9CA3AF] mb-1">Стоимость</p>
                <p className="text-3xl font-bold text-[#111]">от {fmt(item.price)}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">Окончательная цена — после расчёта</p>
              </div>

              <div className="p-6">
                {sent ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                      <Icon name="CheckCircle" size={28} className="text-emerald-600" />
                    </div>
                    <p className="font-semibold text-[#111] mb-1">Заявка отправлена!</p>
                    <p className="text-sm text-[#6B7280]">Свяжемся за 15 минут</p>
                  </div>
                ) : (
                  <form onSubmit={handleOrder} className="space-y-3">
                    <h3 className="font-semibold text-[#111] mb-4">Получить расчёт</h3>
                    {[
                      { label: "Ваше имя", val: name, set: setName, ph: "Александр" },
                      { label: "Телефон / Telegram", val: phone, set: setPhone, ph: "+7 900 000-00-00", req: true },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="text-xs text-[#6B7280] mb-1 block">{f.label}</label>
                        <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} required={f.req}
                          className="w-full h-10 rounded-[10px] border border-[#E5E5E3] px-3 text-sm text-[#111] focus:outline-none focus:border-[#E53935] transition-colors" />
                      </div>
                    ))}
                    <div>
                      <label className="text-xs text-[#6B7280] mb-1 block">Пожелания (необязательно)</label>
                      <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3} placeholder="Размер, комплектация, адрес..."
                        className="w-full rounded-[10px] border border-[#E5E5E3] px-3 py-2.5 text-sm text-[#111] focus:outline-none focus:border-[#E53935] resize-none transition-colors" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full h-12 rounded-[10px] bg-[#E53935] hover:bg-[#C62828] text-white text-sm font-semibold transition-all duration-200 hover:shadow-[0_4px_16px_rgba(229,57,53,0.3)] active:scale-[0.98]">
                      {loading ? "Отправляем..." : "Получить расчёт бесплатно"}
                    </button>
                    <p className="text-center text-[#9CA3AF] text-xs">Без спама · Ответим за 15 минут</p>
                  </form>
                )}
              </div>

              <div className="px-6 pb-5 flex items-center gap-3 border-t border-[#F2F2F0] pt-4">
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Icon name="Phone" size={15} className="text-emerald-700" />
                </div>
                <div>
                  <p className="font-semibold text-[#111] text-sm">+7 (800) 000-00-00</p>
                  <p className="text-xs text-[#9CA3AF]">Пн–Пт 9:00–18:00</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-3">
              <a href="https://t.me/" target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-[10px] bg-[#0088cc]/10 text-[#0088cc] text-sm font-medium hover:bg-[#0088cc]/20 transition-colors border border-[#0088cc]/20">
                <Icon name="Send" size={14} />Telegram
              </a>
              <a href="https://wa.me/" target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-[10px] bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors border border-emerald-200">
                <Icon name="MessageCircle" size={14} />WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#111] mb-6">Похожие модели</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {Object.entries(CATALOG).filter(([k]) => k !== id).slice(0, 3).map(([k, p]) => (
              <Link key={k} to={`/properties/${k}`}
                className="group bg-white rounded-[16px] overflow-hidden border border-[#E5E5E3] hover:border-[#111] card-lift"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div className="h-36 overflow-hidden bg-[#F2F2F0]">
                  <img src={p.imgs[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-1">{p.type}</p>
                  <h3 className="text-sm font-semibold text-[#111] group-hover:text-[#E53935] transition-colors mb-1">{p.name}</h3>
                  <p className="text-[15px] font-bold text-[#111]">от {fmt(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile sticky */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 pb-4 pt-2 bg-white border-t border-[#E5E5E3]">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-[#9CA3AF]">от</p>
            <p className="text-lg font-bold text-[#111]">{fmt(item.price)}</p>
          </div>
          <button
            onClick={() => document.querySelector("form")?.scrollIntoView({ behavior: "smooth" })}
            className="flex-1 h-12 rounded-[10px] bg-[#E53935] text-white text-sm font-semibold hover:bg-[#C62828] transition-colors">
            Получить расчёт
          </button>
        </div>
      </div>
    </div>
  );
}
