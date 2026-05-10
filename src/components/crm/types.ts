export type Order = {
  id: number;
  name: string;
  phone: string;
  email?: string;
  product_name?: string;
  message?: string;
  delivery_address?: string;
  budget_min?: number;
  budget_max?: number;
  status: string;
  kanban_status: string;
  source?: string;
  region?: string;
  deal_amount?: number;
  commission_amount?: number;
  commission_rate: number;
  commission_paid: boolean;
  manager?: string;
  messenger?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
};

export type Product = {
  id: number;
  name: string;
  type: string;
  description?: string;
  price: number;
  dimensions?: string;
  square_meters?: number;
  status: string;
  image_url?: string;
  is_featured: boolean;
  views_count?: number;
  orders_count?: number;
  sales_count?: number;
  total_revenue?: number;
  created_at: string;
};

export type CrmStats = {
  new_orders: number;
  in_progress: number;
  done_orders: number;
  rejected: number;
  total_orders: number;
  total_products: number;
  total_revenue: number;
  total_commission: number;
  paid_commission: number;
  pending_commission: number;
  expected_commission: number;
  avg_deal: number;
  conversion: number;
  by_day: { date: string; orders: number; revenue: number; commission: number }[];
  by_month: { month: string; orders: number; revenue: number; commission: number }[];
  funnel: Record<string, number>;
  by_source: { source: string; count: number }[];
  by_region: { region: string; count: number; revenue: number }[];
  by_product: { name: string; count: number; revenue: number }[];
  recent: Order[];
};

export type Section = "dashboard" | "orders" | "catalog" | "finance" | "analytics" | "settings";

export const KANBAN_COLS = [
  { id: "new", label: "Новая", color: "#3b82f6" },
  { id: "contacted", label: "Связались", color: "#8b5cf6" },
  { id: "sent_calc", label: "Расчёт отправлен", color: "#f59e0b" },
  { id: "waiting", label: "Ожидание", color: "#6b7280" },
  { id: "production", label: "Производство", color: "#06b6d4" },
  { id: "delivery", label: "Доставка", color: "#10b981" },
  { id: "done", label: "Завершено", color: "#22c55e" },
  { id: "rejected", label: "Отказ", color: "#ef4444" },
];

export const SOURCE_LABELS: Record<string, string> = {
  website: "Сайт",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  vk: "ВКонтакте",
  avito: "Авито",
  referral: "Рекомендация",
  call: "Звонок",
  other: "Другое",
};

export function fmt(n: number) {
  if (!n) return "—";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)} млн ₽`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)} тыс ₽`;
  return `${n} ₽`;
}

export function fmtNum(n: number) {
  return new Intl.NumberFormat("ru-RU").format(n);
}
