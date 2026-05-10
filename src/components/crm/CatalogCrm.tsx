import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";
import type { Product } from "./types";
import { fmt } from "./types";
import { api } from "@/lib/api";

type Props = { products: Product[]; onRefresh: () => void };

const PRODUCT_TYPES = ["Бытовка", "Дачный домик", "Блок-контейнер", "Хостблок", "Баня", "Гараж"];

const EMPTY_FORM = {
  name: "", type: "Бытовка", description: "", price: "", dimensions: "", square_meters: "", status: "available", image_url: "", is_featured: false,
};

export function CatalogCrm({ products, onRefresh }: Props) {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setEditProduct(null); setForm(EMPTY_FORM); setFormOpen(true); };
  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ name: p.name, type: p.type, description: p.description || "", price: String(p.price), dimensions: p.dimensions || "", square_meters: String(p.square_meters || ""), status: p.status, image_url: p.image_url || "", is_featured: p.is_featured });
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = { ...form, price: parseInt(form.price) || 0, square_meters: parseFloat(form.square_meters) || null, ...(editProduct ? { id: editProduct.id } : {}) };
    if (editProduct) await api.updateProduct(data);
    else await api.createProduct(data);
    setLoading(false);
    setFormOpen(false);
    onRefresh();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-montserrat text-2xl font-extrabold text-white">Каталог</h1>
          <p className="text-white/40 text-sm">{products.length} товаров</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-xl overflow-hidden border border-white/10">
            {(["grid", "table"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-2 transition-all duration-200 ${view === v ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}>
                <Icon name={v === "grid" ? "LayoutGrid" : "List"} size={16} />
              </button>
            ))}
          </div>
          <Button onClick={openNew} className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm shadow-lg shadow-red-900/30">
            <Icon name="Plus" size={14} className="mr-1.5" />Добавить
          </Button>
        </div>
      </div>

      <div className="relative">
        <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск товаров..."
          className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-red-500/50 rounded-xl" />
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16">
              <Icon name="Package" size={40} className="text-white/15 mx-auto mb-3" />
              <p className="text-white/30">Товаров нет. Добавьте первый!</p>
            </div>
          )}
          {filtered.map((p) => (
            <div key={p.id} className="group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01]"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="relative h-36 overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <Icon name="Package" size={32} className="text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,18,40,0.8), transparent)" }} />
                {p.is_featured && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ХИТ</span>
                )}
                <button onClick={() => openEdit(p)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                  <Icon name="Pencil" size={12} />
                </button>
              </div>
              <div className="p-4">
                <p className="text-white/40 text-[10px] uppercase tracking-wide mb-0.5">{p.type}</p>
                <h3 className="font-montserrat font-bold text-white text-sm leading-snug mb-2">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="font-montserrat font-black text-white">{fmt(p.price)}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <span className={`px-2 py-0.5 rounded-full ${p.status === "available" ? "bg-emerald-500/15 text-emerald-400" : "bg-white/8 text-white/30"}`}>
                      {p.status === "available" ? "Доступно" : p.status === "sold" ? "Продано" : "Архив"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table view */}
      {view === "table" && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Название", "Тип", "Цена", "Размеры", "Статус", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className="border-t border-white/5 hover:bg-white/3 transition-colors" style={i % 2 === 0 ? {} : { background: "rgba(255,255,255,0.015)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {p.image_url ? <img src={p.image_url} alt="" className="w-8 h-8 rounded-lg object-cover" /> : <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center"><Icon name="Package" size={13} className="text-white/30" /></div>}
                      <span className="text-sm font-medium text-white">{p.name}</span>
                      {p.is_featured && <span className="text-[9px] bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded-full">ХИТ</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-white/50">{p.type}</td>
                  <td className="px-4 py-3 text-sm font-bold text-white">{fmt(p.price)}</td>
                  <td className="px-4 py-3 text-xs text-white/40">{p.dimensions || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${p.status === "available" ? "bg-emerald-500/15 text-emerald-400" : "bg-white/8 text-white/30"}`}>
                      {p.status === "available" ? "Доступно" : "Архив"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(p)} className="text-white/30 hover:text-white transition-colors">
                      <Icon name="Pencil" size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-12 text-white/25 text-sm">Товаров нет</p>}
        </div>
      )}

      {/* Product form modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#0b1427", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <h2 className="font-montserrat font-bold text-white">{editProduct ? "Редактировать товар" : "Новый товар"}</h2>
              <button onClick={() => setFormOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <Icon name="X" size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-3 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1"><Label className="text-white/50 text-xs">Название *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="bg-white/5 border-white/10 text-white rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-white/50 text-xs">Тип</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#0f1e3d] border-white/10">{PRODUCT_TYPES.map((t) => <SelectItem key={t} value={t} className="text-white/70">{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-white/50 text-xs">Цена (₽) *</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="bg-white/5 border-white/10 text-white rounded-xl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-white/50 text-xs">Размеры</Label><Input placeholder="6×3×2.7 м" value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} className="bg-white/5 border-white/10 text-white rounded-xl" /></div>
                <div className="space-y-1"><Label className="text-white/50 text-xs">Площадь (м²)</Label><Input type="number" step="0.1" value={form.square_meters} onChange={(e) => setForm({ ...form, square_meters: e.target.value })} className="bg-white/5 border-white/10 text-white rounded-xl" /></div>
              </div>
              <div className="space-y-1"><Label className="text-white/50 text-xs">Описание</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-white/5 border-white/10 text-white rounded-xl resize-none" /></div>
              <div className="space-y-1"><Label className="text-white/50 text-xs">Ссылка на фото</Label><Input placeholder="https://..." value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="bg-white/5 border-white/10 text-white rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="space-y-1">
                  <Label className="text-white/50 text-xs">Статус</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#0f1e3d] border-white/10">
                      <SelectItem value="available" className="text-white/70">Доступно</SelectItem>
                      <SelectItem value="sold" className="text-white/70">Продано</SelectItem>
                      <SelectItem value="archived" className="text-white/70">Архив</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} />
                  <Label className="text-white/60 text-xs">На главной</Label>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="flex-1 border-white/15 text-white/60 hover:text-white rounded-xl">Отмена</Button>
                <Button type="submit" disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl">
                  {loading ? "Сохраняем..." : "Сохранить"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
