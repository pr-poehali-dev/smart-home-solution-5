import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

/* ─── assets ─── */
const A_HOUSE   = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/09435458-b956-4ef3-98d7-97b4a80e7199.jpg";
const A_FACTORY = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/d100c3ce-b7df-433e-b1e2-fd8431b216de.jpg";
const A_SAUNA   = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/380c4527-1e9c-478e-9093-5767a6151a23.jpg";
const A_CABIN   = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/f7142cb7-a7a3-4830-b4c0-37d7d57b5d57.jpg";
const A_INT     = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/cbb14e09-7150-40dd-9492-1b7967e0ad27.jpg";
const A_PROD    = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/921f3008-7ef0-4113-9f74-dc48c87d7ccc.jpg";

/* ─── data ─── */
const MODELS = [
  { id:"1",  name:"Бытовка строительная",   dims:"6×2.4 м", area:14, price:189000, badge:"ХИТ",            img:A_PROD,  img2:A_FACTORY, type:"Бытовка" },
  { id:"3",  name:"Дачный домик с террасой", dims:"6×4 м",   area:24, price:420000, badge:"Можно зимой",    img:A_HOUSE, img2:A_CABIN,   type:"Дачный домик" },
  { id:"7",  name:"Баня на металлокаркасе",  dims:"3×6 м",   area:18, price:360000, badge:"Популярное",     img:A_SAUNA, img2:A_INT,     type:"Баня" },
  { id:"6",  name:"Хостблок на 8 мест",      dims:"12×3 м",  area:36, price:890000, badge:"Под сдачу",      img:A_CABIN, img2:A_HOUSE,   type:"Хостблок" },
  { id:"2",  name:"Бытовка с тамбуром",      dims:"6×3 м",   area:18, price:245000, badge:"В наличии",      img:A_PROD,  img2:A_INT,     type:"Бытовка" },
  { id:"9",  name:"Хозблок для дачи",        dims:"3×3 м",   area:9,  price:95000,  badge:"Бюджетный",      img:A_PROD,  img2:A_FACTORY, type:"Хозблок" },
];

const STEPS = [
  { n:"01", title:"Заявка",      body:"Оставляете заявку онлайн или звоните. Ответим за 15 минут.", icon:"MessageSquare" },
  { n:"02", title:"Расчёт",      body:"Рассчитываем стоимость, согласовываем комплектацию и сроки.", icon:"Calculator" },
  { n:"03", title:"Производство",body:"Строим на заводе. Присылаем фото и видео с производства.", icon:"Wrench" },
  { n:"04", title:"Доставка",    body:"Привозим манипулятором и устанавливаем за 1 день.", icon:"Truck" },
];

const ADVANTAGES = [
  { icon:"Factory",     title:"Собственный завод",          body:"Производим сами — без посредников и наценок." },
  { icon:"Truck",       title:"Доставка по всей России",    body:"Манипулятором. Установка за 1 день на место." },
  { icon:"FileText",    title:"Договор и гарантия",         body:"Официальный договор. Гарантия 1 год на всё." },
  { icon:"Camera",      title:"Фотоотчёты",                 body:"Фото каждого этапа — видите что происходит." },
  { icon:"Thermometer", title:"Тёплые круглый год",         body:"Утепление 100–200 мм. Комфортно при −40°C." },
  { icon:"Sliders",     title:"Кастомизация",               body:"Ваш размер, планировка и отделка под задачу." },
];

const REVIEWS = [
  { name:"Алексей К.",   city:"Москва",        text:"Взял бытовку для стройки. Привезли через 8 дней, поставили за день. Качество отличное, всё по договору.", avatar:"А", stars:5 },
  { name:"Марина С.",    city:"Казань",         text:"Заказали дачный домик с террасой. Очень довольны — утепление хорошее, зимой тепло. Рекомендую.", avatar:"М", stars:5 },
  { name:"Дмитрий В.",   city:"Екатеринбург",   text:"Баня получилась отличная! Парная держит жар хорошо. Ребята работают чётко, без задержек.", avatar:"Д", stars:5 },
  { name:"Сергей Н.",    city:"Краснодар",       text:"Хостблок на 4 места — сдаём вахтовикам уже год. Всё в порядке, конструкция крепкая.", avatar:"С", stars:5 },
];

function fmt(n: number) {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)} млн ₽`;
  return `${Math.round(n/1000)} тыс ₽`;
}

/* ─── mini form ─── */
function QuickForm({ compact = false }: { compact?: boolean }) {
  const [type,  setType]  = useState("");
  const [size,  setSize]  = useState("");
  const [phone, setPhone] = useState("");
  const [done,  setDone]  = useState(false);
  const [busy,  setBusy]  = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await api.createOrder({ name:"Сайт", phone, message:`${type} ${size}`.trim() });
    setBusy(false);
    setDone(true);
  };

  if (done) return (
    <div className="text-center py-8">
      <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-3">
        <Icon name="Check" size={22} className="text-emerald-600" />
      </div>
      <p className="font-semibold text-ink">Заявка принята!</p>
      <p className="text-g600 text-sm mt-1">Ответим в течение 15 минут</p>
    </div>
  );

  const sel = (val: string, set: (v: string) => void, opts: string[], ph: string) => (
    <div className="relative">
      <select value={val} onChange={e => set(e.target.value)}
        className="w-full appearance-none h-11 rounded-xl border border-g200 bg-white px-3 text-sm text-ink focus:outline-none focus:border-ink transition-colors cursor-pointer">
        <option value="">{ph}</option>
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
      <Icon name="ChevronDown" size={14} className="absolute right-3 top-3.5 text-g400 pointer-events-none" />
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-2.5">
      {!compact && (
        <div className="mb-4">
          <p className="text-xs text-[#E53935] font-semibold uppercase tracking-wider mb-1">Бесплатный расчёт</p>
          <h3 className="text-lg font-bold text-ink">Получите цену за 15 минут</h3>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {sel(type, setType, ["Бытовка","Дачный домик","Баня","Хостблок","Хозблок","Другое"], "Тип строения")}
        {sel(size, setSize, ["до 20 м²","20–36 м²","36–60 м²","более 60 м²"], "Площадь")}
      </div>
      <input value={phone} onChange={e => setPhone(e.target.value)} required placeholder="Телефон или Telegram"
        className="w-full h-11 rounded-xl border border-g200 bg-white px-3 text-sm text-ink focus:outline-none focus:border-ink transition-colors" />
      <button type="submit" disabled={busy}
        className="w-full h-11 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white text-sm font-semibold transition-colors disabled:opacity-60 shadow-red">
        {busy ? "Отправляем…" : "Получить расчёт за 15 минут"}
      </button>
      <p className="text-center text-g400 text-xs">Без спама. Ответим быстро.</p>
    </form>
  );
}

/* ─── product card ─── */
function ModelCard({ m }: { m: typeof MODELS[0] }) {
  return (
    <Link to={`/properties/${m.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-card hover-lift">
      <div className="img-wrap h-52 bg-g100">
        <img src={m.img}  alt={m.name} className="img-a w-full h-full object-cover" />
        <img src={m.img2} alt=""       className="img-b" />
        <span className="absolute top-3 left-3 z-10 text-[11px] font-semibold bg-white/90 backdrop-blur-sm text-ink px-2.5 py-1 rounded-full border border-g200">
          {m.badge}
        </span>
      </div>
      <div className="p-5">
        <p className="text-[11px] text-g400 uppercase tracking-wide mb-1">{m.type}</p>
        <h3 className="font-semibold text-ink text-[15px] mb-2 group-hover:text-[#E53935] transition-colors">{m.name}</h3>
        <div className="flex gap-4 text-sm text-g600 mb-4">
          <span>{m.dims}</span>
          <span>{m.area} м²</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-ink text-lg">от {fmt(m.price)}</span>
          <span className="text-xs font-medium text-g600 group-hover:text-ink flex items-center gap-1 transition-colors">
            Расчёт <Icon name="ArrowRight" size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── page ─── */
export default function HomePage() {
  return (
    <div className="bg-white">

      {/* ════════════ HERO ════════════ */}
      <section className="border-b border-g200">
        <div className="container py-16 md:py-24">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 xl:gap-20 items-start">

            {/* left */}
            <div className="max-w-xl">
              {/* eyebrow */}
              <div className="inline-flex items-center gap-2 text-xs font-medium text-g600 border border-g200 rounded-full px-3 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Собственное производство · Доставка по всей России
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-[56px] font-extrabold text-ink leading-[1.08] tracking-[-0.03em] mb-6">
                Модульные дома,<br />
                бытовки и бани{" "}
                <span className="text-[#E53935]">напрямую</span>{" "}
                от производства
              </h1>

              <ul className="text-g600 text-[17px] space-y-1.5 mb-10">
                {["Изготовление от 7 дней","Доставка по всей России","Договор и гарантия 1 год"].map(t => (
                  <li key={t} className="flex items-center gap-2">
                    <Icon name="Check" size={15} className="text-[#E53935] shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>

              {/* micro stats */}
              <div className="grid grid-cols-4 gap-4 mb-10 pb-10 border-b border-g100">
                {[
                  { val:"500+",   sub:"объектов" },
                  { val:"7 дней", sub:"производство" },
                  { val:"1 год",  sub:"гарантия" },
                  { val:"по РФ",  sub:"доставка" },
                ].map(s => (
                  <div key={s.val}>
                    <p className="text-2xl font-bold text-ink leading-none">{s.val}</p>
                    <p className="text-xs text-g400 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/properties"
                  className="flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-ink hover:bg-[#222] text-white text-sm font-semibold transition-colors">
                  <Icon name="Grid3x3" size={15} /> Смотреть каталог
                </Link>
                <a href="#calc"
                  className="flex items-center justify-center gap-2 h-12 px-7 rounded-xl border border-g200 text-ink text-sm font-semibold hover:border-ink hover:bg-g50 transition-all">
                  <Icon name="Calculator" size={15} /> Получить расчёт
                </a>
              </div>
            </div>

            {/* right: form card */}
            <div className="w-full bg-white rounded-2xl border border-g200 shadow-panel p-6">
              <QuickForm />
            </div>
          </div>
        </div>

        {/* full-width photo strip */}
        <div className="h-72 md:h-96 overflow-hidden">
          <img src={A_HOUSE} alt="Модульный дом" className="w-full h-full object-cover object-center" />
        </div>
      </section>

      {/* ════════════ MODELS ════════════ */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-semibold text-[#E53935] uppercase tracking-widest mb-2">Популярные модели</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-ink">Готовые решения</h2>
              <p className="text-g600 mt-2">Выберите модель — мы рассчитаем под вашу задачу</p>
            </div>
            <Link to="/properties" className="text-sm font-semibold text-ink underline underline-offset-4 decoration-g200 hover:decoration-ink transition-all whitespace-nowrap">
              Весь каталог →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MODELS.map(m => <ModelCard key={m.id} m={m} />)}
          </div>
        </div>
      </section>

      {/* ════════════ ADVANTAGES ════════════ */}
      <section className="py-20 bg-g50 border-y border-g200">
        <div className="container">
          <div className="mb-12">
            <p className="text-xs font-semibold text-[#E53935] uppercase tracking-widest mb-2">Почему нас выбирают</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink">Реальное производство,<br />а не перепродажа</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-g200 rounded-2xl overflow-hidden">
            {ADVANTAGES.map((a, i) => (
              <div key={i} className="bg-white p-7 group hover:bg-g50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-g100 flex items-center justify-center mb-4 group-hover:bg-[#E53935] transition-colors">
                  <Icon name={a.icon} size={19} className="text-g600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-ink mb-1.5">{a.title}</h3>
                <p className="text-sm text-g600 leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ HOW WE WORK ════════════ */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-semibold text-[#E53935] uppercase tracking-widest mb-2">Процесс</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3">Как мы работаем</h2>
              <p className="text-g600 mb-12 text-[17px]">От заявки до доставки — прозрачно и в срок.</p>
              <div className="space-y-8">
                {STEPS.map((s, i) => (
                  <div key={s.n} className="flex gap-5">
                    <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm
                      ${i === 0 ? "bg-[#E53935] text-white" : "bg-g100 text-g400"}`}>
                      {s.n}
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink mb-1">{s.title}</h3>
                      <p className="text-sm text-g600 leading-relaxed">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 lg:mt-0">
              <img src={A_FACTORY} alt="Производство" className="rounded-2xl w-full aspect-[4/5] object-cover col-span-2" />
              <img src={A_PROD}    alt="Изготовление" className="rounded-2xl w-full aspect-square object-cover" />
              <img src={A_CABIN}   alt="Результат"    className="rounded-2xl w-full aspect-square object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ PRODUCTION GALLERY ════════════ */}
      <section className="py-4 bg-g50 border-y border-g200">
        <div className="container">
          <div className="grid grid-cols-3 gap-3">
            {[A_FACTORY, A_SAUNA, A_INT].map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden aspect-[4/3]">
                <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ REVIEWS ════════════ */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-12">
            <p className="text-xs font-semibold text-[#E53935] uppercase tracking-widest mb-2">Отзывы</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink">Что говорят клиенты</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-g50 border border-g200 rounded-2xl p-5 hover-lift">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({length: r.stars}).map((_, j) => (
                    <Icon key={j} name="Star" size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-ink leading-relaxed mb-4">«{r.text}»</p>
                <div className="flex items-center gap-2.5 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-g200 flex items-center justify-center text-xs font-bold text-g600">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink leading-none">{r.name}</p>
                    <p className="text-xs text-g400 mt-0.5">{r.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FINAL CTA ════════════ */}
      <section id="calc" className="py-20 bg-ink">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                Получите расчёт<br />
                <span className="text-[#E53935]">бесплатно</span> — за 15 минут
              </h2>
              <p className="text-white/55 text-[17px] mb-8 leading-relaxed">
                Опишите задачу. Мы подберём модель, посчитаем стоимость и ответим на все вопросы.
              </p>
              <div className="space-y-3">
                {["Расчёт бесплатно — без обязательств","Работаем по всей России","Официальный договор · Гарантия 1 год"].map(t => (
                  <div key={t} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E53935]/20 flex items-center justify-center shrink-0">
                      <Icon name="Check" size={11} className="text-[#E53935]" />
                    </div>
                    <p className="text-white/70 text-sm">{t}</p>
                  </div>
                ))}
              </div>

              {/* contacts */}
              <div className="flex gap-3 mt-10">
                <a href="https://t.me/" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 h-11 px-5 rounded-xl bg-white/8 hover:bg-white/14 text-white text-sm font-medium transition-colors border border-white/10">
                  <Icon name="Send" size={15} /> Telegram
                </a>
                <a href="https://wa.me/" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 h-11 px-5 rounded-xl bg-white/8 hover:bg-white/14 text-white text-sm font-medium transition-colors border border-white/10">
                  <Icon name="MessageCircle" size={15} /> WhatsApp
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-panel">
              <QuickForm compact />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden px-4 pb-4 pt-3 bg-white border-t border-g200">
        <a href="#calc"
          className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#E53935] text-white text-sm font-semibold shadow-red">
          <Icon name="Calculator" size={16} /> Получить расчёт бесплатно
        </a>
      </div>
    </div>
  );
}
