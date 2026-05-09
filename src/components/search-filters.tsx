import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Filter, X } from "lucide-react"

const BUILDING_TYPES = ["Бытовка", "Дачный домик", "Хостблок", "Баня"]

const INSULATION_OPTIONS = [
  { value: "none", label: "Без утепления" },
  { value: "50mm", label: "Минвата 50 мм" },
  { value: "100mm", label: "Минвата 100 мм" },
  { value: "150mm", label: "Минвата 150 мм" },
  { value: "pir", label: "ПИР-плита 50 мм" },
]

const formatPrice = (price: number) => {
  if (price >= 1000000) return `${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)} млн`
  return `${(price / 1000).toFixed(0)} тыс`
}

export function SearchFilters() {
  const [priceRange, setPriceRange] = useState([100000, 3000000])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedInsulation, setSelectedInsulation] = useState<string | null>(null)

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleReset = () => {
    setPriceRange([100000, 3000000])
    setSelectedTypes([])
    setSelectedInsulation(null)
  }

  return (
    <div className="w-full rounded-lg border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Фильтры</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 gap-1 text-muted-foreground">
          <X className="h-4 w-4" />
          Сбросить
        </Button>
      </div>

      {/* Диапазон цен */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Цена</Label>
        <Slider
          value={priceRange}
          min={100000}
          max={3000000}
          step={50000}
          onValueChange={setPriceRange}
        />
        <div className="flex items-center justify-between gap-2">
          <div className="rounded-md border bg-muted px-2.5 py-1 text-xs font-medium">
            от {formatPrice(priceRange[0])} ₽
          </div>
          <div className="h-px flex-1 bg-border" />
          <div className="rounded-md border bg-muted px-2.5 py-1 text-xs font-medium">
            {priceRange[1] >= 3000000 ? "до 3+ млн ₽" : `до ${formatPrice(priceRange[1])} ₽`}
          </div>
        </div>
      </div>

      {/* Тип постройки */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Тип постройки</Label>
        <div className="grid grid-cols-2 gap-2">
          {BUILDING_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`rounded-md border px-3 py-2 text-sm font-medium text-left transition-colors ${
                selectedTypes.includes(type)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Утеплитель */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Утеплитель</Label>
        <div className="space-y-2">
          {INSULATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                setSelectedInsulation(selectedInsulation === opt.value ? null : opt.value)
              }
              className={`w-full rounded-md border px-3 py-2 text-sm font-medium text-left transition-colors ${
                selectedInsulation === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Button className="w-full">Применить</Button>
    </div>
  )
}