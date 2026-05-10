import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";
import type { Order } from "./types";
import { KANBAN_COLS, fmt } from "./types";

const PRODUCT_TYPES = ["Бытовка", "Дачный домик", "Хостблок", "Баня", "Блок-контейнер", "Гараж"];
const SOURCES = ["website", "telegram", "whatsapp", "vk", "avito", "referral", "call", "other"];
const SOURCE_LABELS: Record<string, string> = { website: "Сайт", telegram: "Telegram", whatsapp: "WhatsApp", vk: "ВКонтакте", avito: "Авито", referral: "Рекомендация", call: "Звонок", other: "Другое" };

type Props = { order: Order; onClose: () => void; onRefresh: () => void };

export function OrderPanel({ order, onClose, onRefresh }: Props) {
  const isNew = order.id === 0;
  const [form, setForm] = useState<Partial<Order>>({ ...order });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"info" | "finance">("info");

  const commission = form.deal_amount ? Math.round(form.deal_amount * (form.commission_rate || 5) / 100) : 0;

  const handleSave = async () => {
    setLoading(true);
    const data = { ...form, commission_amount: commission };
    if (isNew) {
      await api.createOrder(data);
    } else {
      await api.updateOrder(data);
    }
    setLoading(false);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-md flex flex-col overflow-hidden"
        style={{ background: "#0b1427", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div>
            <h2 className="font-montserrat font-bold text-white">{isNew ? "Новая заявка" : order.name}</h2>
            {!isNew && <p className="text-white/40 text-xs mt-0.5">#{order.id} · {new Date(order.created_at).toLocaleDateString("ru-RU")}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all">
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Kanban status */}
        {!isNew && (
          <div className="px-5 pt-4">
            <div className="flex gap-1 flex-wrap">
              {KANBAN_COLS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setForm({ ...form, kanban_status: col.id })}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all duration-200"
                  style={{
                    background: form.kanban_status === col.id ? col.color : "rgba(255,255,255,0.05)",
                    color: form.kanban_status === col.id ? "white" : "rgba(255,255,255,0.4)",
                    border: `1px solid ${form.kanban_status === col.id ? col.color : "transparent"}`,
                  }}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-4">
          {(["info", "finance"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === t ? "bg-red-600 text-white" : "text-white/40 hover:text-white"}`}
            >
              {t === "info" ? "Информация" : "Финансы"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {tab === "info" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Имя клиента" value={form.name || ""} onChange={(v) => setForm({ ...form, name: v })} required />
                <Field label="Телефон" value={form.phone || ""} onChange={(v) => setForm({ ...form, phone: v })} required />
              </div>
              <Field label="Email" value={form.email || ""} onChange={(v) => setForm({ ...form, email: v })} />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-white/50 text-xs">Тип строения</Label>
                  <Select value={form.product_name || ""} onValueChange={(v) => setForm({ ...form, product_name: v })}>
                    <SelectTrigger className="h-9 bg-white/5 border-white/10 text-white text-sm rounded-xl">
                      <SelectValue placeholder="Выбрать" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1e3d] border-white/10">
                      {PRODUCT_TYPES.map((t) => <SelectItem key={t} value={t} className="text-white/70">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-white/50 text-xs">Источник</Label>
                  <Select value={form.source || "website"} onValueChange={(v) => setForm({ ...form, source: v })}>
                    <SelectTrigger className="h-9 bg-white/5 border-white/10 text-white text-sm rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1e3d] border-white/10">
                      {SOURCES.map((s) => <SelectItem key={s} value={s} className="text-white/70">{SOURCE_LABELS[s]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Field label="Регион / Город" value={form.region || ""} onChange={(v) => setForm({ ...form, region: v })} />
              <Field label="Адрес доставки" value={form.delivery_address || ""} onChange={(v) => setForm({ ...form, delivery_address: v })} />
              <div className="space-y-1">
                <Label className="text-white/50 text-xs">Комментарий клиента</Label>
                <Textarea value={form.message || ""} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-red-500/50 resize-none text-sm rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/50 text-xs">Заметки менеджера</Label>
                <Textarea value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-red-500/50 resize-none text-sm rounded-xl"
                  placeholder="Внутренние заметки..." />
              </div>
            </>
          )}

          {tab === "finance" && (
            <>
              <div className="rounded-2xl p-4 mb-2" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="font-montserrat text-2xl font-black text-white">{fmt(form.deal_amount || 0)}</p>
                    <p className="text-white/40 text-xs">Сумма сделки</p>
                  </div>
                  <div>
                    <p className="font-montserrat text-2xl font-black text-red-400">{fmt(commission)}</p>
                    <p className="text-white/40 text-xs">Ваша комиссия</p>
                  </div>
                </div>
              </div>
              <Field label="Сумма сделки (₽)" value={form.deal_amount?.toString() || ""} onChange={(v) => setForm({ ...form, deal_amount: parseInt(v) || 0 })} type="number" />
              <div className="space-y-1">
                <Label className="text-white/50 text-xs">Ставка комиссии (%)</Label>
                <div className="flex items-center gap-3">
                  <input type="range" min={1} max={20} step={0.5} value={form.commission_rate || 5}
                    onChange={(e) => setForm({ ...form, commission_rate: parseFloat(e.target.value) })}
                    className="flex-1 accent-red-600 cursor-pointer" />
                  <span className="text-white font-bold text-sm w-10 text-right">{form.commission_rate || 5}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <span className="text-white/60 text-sm">Комиссия выплачена</span>
                <button
                  onClick={() => setForm({ ...form, commission_paid: !form.commission_paid })}
                  className={`w-11 h-6 rounded-full transition-all duration-200 ${form.commission_paid ? "bg-emerald-500" : "bg-white/15"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white mx-1 transition-transform duration-200 ${form.commission_paid ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              {form.commission_paid && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm px-1">
                  <Icon name="CheckCircle" size={14} />
                  <span>Комиссия {fmt(commission)} выплачена</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/8 flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1 border-white/15 text-white/70 hover:text-white hover:bg-white/8 rounded-xl">
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-900/30">
            {loading ? "Сохраняем..." : isNew ? "Создать" : "Сохранить"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-white/50 text-xs">{label}{required && " *"}</Label>
      <Input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        required={required}
        className="h-9 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-red-500/50 text-sm rounded-xl"
      />
    </div>
  );
}
