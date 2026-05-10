export const COMMISSION_RATE = 0.05;

export type OrderStatus =
  | "new" | "contacted" | "estimate_sent" | "waiting"
  | "production" | "delivery" | "done" | "cancelled";

export type Order = {
  id: number;
  name: string;
  phone: string;
  messenger: "telegram" | "whatsapp" | "phone";
  product_name: string;
  product_type: string;
  budget: number;
  deal_amount: number;
  commission: number;
  commission_paid: boolean;
  delivery_address: string;
  source: string;
  message: string;
  status: OrderStatus;
  manager: string;
  created_at: string;
  updated_at: string;
  timeline: { date: string; text: string; author: string }[];
};

export type Product = {
  id: number;
  name: string;
  type: string;
  price: number;
  dimensions: string;
  square_meters: number;
  status: "available" | "sold" | "archived";
  image_url: string;
  is_featured: boolean;
  views: number;
  leads: number;
  sales: number;
  revenue: number;
  created_at: string;
};

const CABIN = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/f7142cb7-a7a3-4830-b4c0-37d7d57b5d57.jpg";
const PRODUCT = "https://cdn.poehali.dev/projects/bc841fec-1189-4eea-854d-8066280392e4/files/921f3008-7ef0-4113-9f74-dc48c87d7ccc.jpg";

export const MOCK_ORDERS: Order[] = [
  { id: 1, name: "Андрей Смирнов", phone: "+7 912 345-67-89", messenger: "telegram", product_name: "Бытовка 6×3 м", product_type: "Бытовка", budget: 250000, deal_amount: 245000, commission: 12250, commission_paid: true, delivery_address: "Московская обл., Подольск", source: "Сайт", message: "Нужна к 15 числу, без санузла", status: "done", manager: "Алексей", created_at: "2024-05-01", updated_at: "2024-05-10", timeline: [{ date: "2024-05-01", text: "Заявка получена", author: "Система" }, { date: "2024-05-02", text: "Связались, уточнили детали", author: "Алексей" }, { date: "2024-05-10", text: "Сделка завершена", author: "Алексей" }] },
  { id: 2, name: "Иван Петров", phone: "+7 903 111-22-33", messenger: "whatsapp", product_name: "Дачный домик 6×4 м", product_type: "Дачный домик", budget: 450000, deal_amount: 420000, commission: 21000, commission_paid: false, delivery_address: "Тверская обл., Конаково", source: "Авито", message: "Хочу с террасой и панорамными окнами", status: "production", manager: "Алексей", created_at: "2024-05-05", updated_at: "2024-05-12", timeline: [{ date: "2024-05-05", text: "Заявка с Авито", author: "Система" }, { date: "2024-05-06", text: "Отправлен расчёт", author: "Алексей" }, { date: "2024-05-12", text: "Запущено производство", author: "Алексей" }] },
  { id: 3, name: "Ольга Николаева", phone: "+7 925 777-88-99", messenger: "telegram", product_name: "Хостблок 12×3 м", product_type: "Хостблок", budget: 900000, deal_amount: 890000, commission: 44500, commission_paid: false, delivery_address: "Ленинградская обл., Выборг", source: "Сайт", message: "Для строительной бригады, нужно ASAP", status: "delivery", manager: "Алексей", created_at: "2024-05-08", updated_at: "2024-05-14", timeline: [{ date: "2024-05-08", text: "Заявка получена", author: "Система" }, { date: "2024-05-09", text: "Согласован проект", author: "Алексей" }, { date: "2024-05-14", text: "Отправлено манипулятором", author: "Алексей" }] },
  { id: 4, name: "Сергей Власов", phone: "+7 916 333-44-55", messenger: "phone", product_name: "Баня 4×6 м", product_type: "Баня", budget: 380000, deal_amount: 0, commission: 0, commission_paid: false, delivery_address: "Краснодарский край, Сочи", source: "ВКонтакте", message: "Деревянная баня под ключ", status: "estimate_sent", manager: "Алексей", created_at: "2024-05-11", updated_at: "2024-05-11", timeline: [{ date: "2024-05-11", text: "Заявка из ВКонтакте", author: "Система" }, { date: "2024-05-11", text: "Расчёт отправлен", author: "Алексей" }] },
  { id: 5, name: "Мария Кузнецова", phone: "+7 989 555-66-77", messenger: "whatsapp", product_name: "Бытовка с санузлом 6×3 м", product_type: "Бытовка", budget: 270000, deal_amount: 0, commission: 0, commission_paid: false, delivery_address: "Свердловская обл., Екатеринбург", source: "Яндекс.Директ", message: "С электрикой и водоснабжением", status: "new", manager: "Алексей", created_at: "2024-05-15", updated_at: "2024-05-15", timeline: [{ date: "2024-05-15", text: "Заявка с сайта (Я.Директ)", author: "Система" }] },
  { id: 6, name: "Дмитрий Алексеев", phone: "+7 911 222-33-44", messenger: "telegram", product_name: "Блок-контейнер офис", product_type: "Блок-контейнер", budget: 330000, deal_amount: 0, commission: 0, commission_paid: false, delivery_address: "Новосибирская обл., Новосибирск", source: "Сайт", message: "Под временный офис, 3 рабочих места", status: "contacted", manager: "Алексей", created_at: "2024-05-13", updated_at: "2024-05-14", timeline: [{ date: "2024-05-13", text: "Заявка получена", author: "Система" }, { date: "2024-05-14", text: "Позвонили, уточнили задачи", author: "Алексей" }] },
  { id: 7, name: "Артём Новиков", phone: "+7 926 888-99-00", messenger: "whatsapp", product_name: "Дачный домик 8×4 м", product_type: "Дачный домик", budget: 620000, deal_amount: 0, commission: 0, commission_paid: false, delivery_address: "Калужская обл., Обнинск", source: "Instagram", message: "Хочу с балконом и сауной", status: "waiting", manager: "Алексей", created_at: "2024-05-10", updated_at: "2024-05-12", timeline: [{ date: "2024-05-10", text: "Заявка из Instagram", author: "Система" }, { date: "2024-05-12", text: "Ожидает решения по бюджету", author: "Алексей" }] },
  { id: 8, name: "Павел Орлов", phone: "+7 905 111-22-55", messenger: "phone", product_name: "Хозблок 3×6 м", product_type: "Хозблок", budget: 180000, deal_amount: 0, commission: 0, commission_paid: false, delivery_address: "Ярославская обл., Ярославль", source: "Рекомендация", message: "Для хранения инвентаря", status: "cancelled", manager: "Алексей", created_at: "2024-05-03", updated_at: "2024-05-05", timeline: [{ date: "2024-05-03", text: "Заявка получена", author: "Система" }, { date: "2024-05-05", text: "Клиент отказался — нашёл дешевле", author: "Алексей" }] },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "Бытовка строительная 6×2.4 м", type: "Бытовка", price: 189000, dimensions: "6×2.4×2.5 м", square_meters: 14, status: "available", image_url: PRODUCT, is_featured: true, views: 1240, leads: 47, sales: 23, revenue: 4347000, created_at: "2024-01-15" },
  { id: 2, name: "Бытовка с тамбуром 6×3 м", type: "Бытовка", price: 245000, dimensions: "6×3×2.5 м", square_meters: 18, status: "available", image_url: PRODUCT, is_featured: false, views: 890, leads: 31, sales: 14, revenue: 3430000, created_at: "2024-01-20" },
  { id: 3, name: "Дачный домик с террасой 6×4 м", type: "Дачный домик", price: 420000, dimensions: "6×4×3 м", square_meters: 24, status: "available", image_url: CABIN, is_featured: true, views: 2100, leads: 68, sales: 19, revenue: 7980000, created_at: "2024-02-01" },
  { id: 4, name: "Хостблок на 8 мест 12×3 м", type: "Хостблок", price: 890000, dimensions: "12×3×2.7 м", square_meters: 36, status: "available", image_url: CABIN, is_featured: true, views: 760, leads: 24, sales: 8, revenue: 7120000, created_at: "2024-02-10" },
  { id: 5, name: "Баня 4×6 м на металлокаркасе", type: "Баня", price: 380000, dimensions: "4×6×2.8 м", square_meters: 24, status: "available", image_url: CABIN, is_featured: false, views: 980, leads: 35, sales: 11, revenue: 4180000, created_at: "2024-03-01" },
  { id: 6, name: "Блок-контейнер офис 20 фут", type: "Блок-контейнер", price: 320000, dimensions: "6×2.4×2.6 м", square_meters: 14, status: "available", image_url: PRODUCT, is_featured: false, views: 540, leads: 18, sales: 9, revenue: 2880000, created_at: "2024-03-15" },
];

export const REVENUE_DATA = [
  { month: "Янв", revenue: 1240000, commission: 62000, orders: 8 },
  { month: "Фев", revenue: 1890000, commission: 94500, orders: 12 },
  { month: "Мар", revenue: 2340000, commission: 117000, orders: 15 },
  { month: "Апр", revenue: 1780000, commission: 89000, orders: 11 },
  { month: "Май", revenue: 3120000, commission: 156000, orders: 19 },
  { month: "Июн", revenue: 2670000, commission: 133500, orders: 16 },
];

export const SOURCE_DATA = [
  { name: "Сайт", value: 38, color: "#DC2626" },
  { name: "Авито", value: 22, color: "#3B82F6" },
  { name: "Яндекс.Директ", value: 18, color: "#8B5CF6" },
  { name: "ВКонтакте", value: 12, color: "#F59E0B" },
  { name: "Рекомендации", value: 10, color: "#10B981" },
];

export const KANBAN_COLUMNS: { id: OrderStatus; label: string; color: string }[] = [
  { id: "new", label: "Новая", color: "#3B82F6" },
  { id: "contacted", label: "Связались", color: "#8B5CF6" },
  { id: "estimate_sent", label: "Расчёт отправлен", color: "#F59E0B" },
  { id: "waiting", label: "Ожидание", color: "#64748B" },
  { id: "production", label: "Производство", color: "#F97316" },
  { id: "delivery", label: "Доставка", color: "#06B6D4" },
  { id: "done", label: "Завершено", color: "#10B981" },
  { id: "cancelled", label: "Отказ", color: "#EF4444" },
];

export function calcStats(orders: Order[]) {
  const done = orders.filter(o => o.status === "done");
  const active = orders.filter(o => !["done", "cancelled"].includes(o.status));
  const totalRevenue = done.reduce((s, o) => s + o.deal_amount, 0);
  const totalCommission = done.reduce((s, o) => s + o.commission, 0);
  const paidCommission = done.filter(o => o.commission_paid).reduce((s, o) => s + o.commission, 0);
  const pendingCommission = totalCommission - paidCommission;
  const avgDeal = done.length > 0 ? Math.round(totalRevenue / done.length) : 0;
  const conversion = orders.length > 0 ? Math.round((done.length / orders.length) * 100) : 0;
  const expectedCommission = active.reduce((s, o) => s + o.budget * COMMISSION_RATE, 0);

  return { totalRevenue, totalCommission, paidCommission, pendingCommission, avgDeal, conversion, expectedCommission, doneCount: done.length, newCount: orders.filter(o => o.status === "new").length, activeCount: active.length };
}
