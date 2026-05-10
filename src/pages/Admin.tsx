import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "@/lib/api";
import Icon from "@/components/ui/icon";

type Stats = {
  total_orders: number;
  new_orders: number;
  done_orders: number;
  total_products: number;
  orders_by_day: { date: string; orders: number }[];
  orders_by_status: { status: string; count: number }[];
};

type Order = {
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
  created_at: string;
};

type Product = {
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
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Выполнена",
  cancelled: "Отменена",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  done: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const PRODUCT_TYPES = ["Бытовка", "Дачный домик", "Блок-контейнер", "Хостблок", "Баня", "Гараж"];

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await api.login(password);
    setLoading(false);
    if (res.token) {
      localStorage.setItem("admin_token", res.token);
      onLogin();
    } else {
      setError("Неверный пароль");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Lock" size={24} className="text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl">Вход в админ-панель</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Пароль</Label>
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Входим..." : "Войти"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductForm({ product, onSave, onClose }: { product?: Product; onSave: () => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: product?.name || "",
    type: product?.type || "Бытовка",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    dimensions: product?.dimensions || "",
    square_meters: product?.square_meters?.toString() || "",
    status: product?.status || "available",
    image_url: product?.image_url || "",
    is_featured: product?.is_featured || false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      ...form,
      price: parseInt(form.price) || 0,
      square_meters: parseFloat(form.square_meters) || null,
      ...(product?.id ? { id: product.id } : {}),
    };
    if (product?.id) {
      await api.updateProduct(data);
    } else {
      await api.createProduct(data);
    }
    setLoading(false);
    onSave();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label>Название *</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="space-y-1.5">
          <Label>Тип</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRODUCT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Цена (₽) *</Label>
          <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        </div>
        <div className="space-y-1.5">
          <Label>Размеры</Label>
          <Input placeholder="6×3×2.7 м" value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Площадь (м²)</Label>
          <Input type="number" step="0.1" value={form.square_meters} onChange={(e) => setForm({ ...form, square_meters: e.target.value })} />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Описание</Label>
          <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Ссылка на фото</Label>
          <Input placeholder="https://..." value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Статус</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Доступно</SelectItem>
              <SelectItem value="sold">Продано</SelectItem>
              <SelectItem value="archived">Архив</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} id="featured" />
          <Label htmlFor="featured">На главной</Label>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Отмена</Button>
        <Button type="submit" className="flex-1" disabled={loading}>{loading ? "Сохраняем..." : "Сохранить"}</Button>
      </div>
    </form>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadData = useCallback(async () => {
    const [s, o, p] = await Promise.all([api.getStats(), api.getOrders(), api.getProducts()]);
    if (!s.error) setStats(s);
    if (Array.isArray(o)) setOrders(o);
    if (Array.isArray(p)) setProducts(p);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { setChecking(false); return; }
    api.checkAuth().then((res) => {
      if (res.ok) { setAuthed(true); loadData(); }
      setChecking(false);
    });
  }, [loadData]);

  const handleLogin = () => { setAuthed(true); loadData(); };
  const handleLogout = () => { localStorage.removeItem("admin_token"); setAuthed(false); };

  const handleOrderStatus = async (id: number, status: string) => {
    await api.updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  if (checking) return <div className="min-h-screen flex items-center justify-center"><Icon name="Loader2" size={32} className="animate-spin text-primary" /></div>;
  if (!authed) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="LayoutDashboard" size={20} className="text-primary" />
          <span className="font-semibold">Админ-панель МодульСтрой</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <Icon name="LogOut" size={16} className="mr-1.5" />
          Выйти
        </Button>
      </div>

      <div className="container py-6 px-4 md:px-6">
        <Tabs defaultValue="stats">
          <TabsList className="mb-6">
            <TabsTrigger value="stats">Статистика</TabsTrigger>
            <TabsTrigger value="orders">
              Заявки
              {stats?.new_orders ? <span className="ml-1.5 rounded-full bg-red-500 text-white text-xs px-1.5 py-0.5">{stats.new_orders}</span> : null}
            </TabsTrigger>
            <TabsTrigger value="products">Товары</TabsTrigger>
          </TabsList>

          {/* СТАТИСТИКА */}
          <TabsContent value="stats">
            {stats ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Всего заявок", value: stats.total_orders, icon: "FileText", color: "text-blue-600" },
                    { label: "Новых заявок", value: stats.new_orders, icon: "Bell", color: "text-orange-500" },
                    { label: "Выполнено", value: stats.done_orders, icon: "CheckCircle", color: "text-green-600" },
                    { label: "Товаров в каталоге", value: stats.total_products, icon: "Package", color: "text-purple-600" },
                  ].map((item) => (
                    <Card key={item.label}>
                      <CardContent className="pt-5 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                            <p className="text-3xl font-bold mt-1">{item.value}</p>
                          </div>
                          <Icon name={item.icon} size={22} className={item.color} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {stats.orders_by_day.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle className="text-base">Заявки за 30 дней</CardTitle></CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={stats.orders_by_day}>
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                          <Tooltip labelFormatter={(v) => `Дата: ${v}`} formatter={(v) => [`${v} заявок`]} />
                          <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[3,3,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">Загружаем данные...</div>
            )}
          </TabsContent>

          {/* ЗАЯВКИ */}
          <TabsContent value="orders">
            <div className="space-y-3">
              {orders.length === 0 && <div className="text-center py-16 text-muted-foreground">Заявок пока нет</div>}
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{order.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                          <span className="text-xs text-muted-foreground">#{order.id}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Icon name="Phone" size={13} />{order.phone}</span>
                          {order.email && <span className="flex items-center gap-1"><Icon name="Mail" size={13} />{order.email}</span>}
                          {order.product_name && <span className="flex items-center gap-1"><Icon name="Package" size={13} />{order.product_name}</span>}
                        </div>
                        {order.message && <p className="text-sm mt-1 text-foreground/80">{order.message}</p>}
                        {order.delivery_address && <p className="text-xs text-muted-foreground">Адрес: {order.delivery_address}</p>}
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString("ru-RU")}</p>
                      </div>
                      <Select value={order.status} onValueChange={(v) => handleOrderStatus(order.id, v)}>
                        <SelectTrigger className="w-36 shrink-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Новая</SelectItem>
                          <SelectItem value="in_progress">В работе</SelectItem>
                          <SelectItem value="done">Выполнена</SelectItem>
                          <SelectItem value="cancelled">Отменена</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ТОВАРЫ */}
          <TabsContent value="products">
            <div className="flex justify-end mb-4">
              <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditProduct(undefined); }}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditProduct(undefined)}>
                    <Icon name="Plus" size={16} className="mr-1.5" />
                    Добавить товар
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editProduct ? "Редактировать товар" : "Новый товар"}</DialogTitle>
                  </DialogHeader>
                  <ProductForm
                    product={editProduct}
                    onSave={() => api.getProducts().then((p) => Array.isArray(p) && setProducts(p))}
                    onClose={() => { setDialogOpen(false); setEditProduct(undefined); }}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-3">
              {products.length === 0 && <div className="text-center py-16 text-muted-foreground">Товаров пока нет</div>}
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="h-14 w-14 rounded-md object-cover shrink-0" />
                        ) : (
                          <div className="h-14 w-14 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                            <Icon name="Package" size={22} className="text-slate-400" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">{product.name}</span>
                            {product.is_featured && <Badge variant="secondary" className="text-xs">На главной</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{product.type} {product.dimensions && `• ${product.dimensions}`}</p>
                          <p className="text-sm font-medium text-primary">{product.price.toLocaleString("ru-RU")} ₽</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setEditProduct(product); setDialogOpen(true); }}
                      >
                        <Icon name="Pencil" size={15} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}