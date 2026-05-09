import { PropertyCard } from "@/components/property-card"
import { SearchFilters } from "@/components/search-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid2X2, List, MapPin, Search, SlidersHorizontal } from "lucide-react"

export default function PropertiesPage() {
  const properties = [
    {
      id: "1",
      title: "Бытовка строительная 6×2.4 м",
      type: "Бытовка",
      address: "Отправка по всей России",
      price: 189000,
      bedrooms: 1,
      bathrooms: 0,
      squareFeet: 14,
      yearBuilt: 2024,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
      dimensions: "6×2.4×2.5 м",
    },
    {
      id: "2",
      title: "Бытовка с тамбуром 6×3 м",
      type: "Бытовка",
      address: "Отправка по всей России",
      price: 245000,
      bedrooms: 1,
      bathrooms: 0,
      squareFeet: 18,
      yearBuilt: 2024,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
      dimensions: "6×3×2.5 м",
    },
    {
      id: "3",
      title: "Ночной домик с санузлом 6×3 м",
      type: "Ночной домик",
      address: "Отправка по всей России",
      price: 390000,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 18,
      yearBuilt: 2024,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
      dimensions: "6×3×2.7 м",
    },
    {
      id: "4",
      title: "Ночной домик двухместный 8×3 м",
      type: "Ночной домик",
      address: "Отправка по всей России",
      price: 520000,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 24,
      yearBuilt: 2024,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
      dimensions: "8×3×2.7 м",
    },
    {
      id: "5",
      title: "Хостблок на 4 места 6×3 м",
      type: "Хостблок",
      address: "Отправка по всей России",
      price: 480000,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 18,
      yearBuilt: 2024,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
      dimensions: "6×3×2.7 м",
    },
    {
      id: "6",
      title: "Хостблок на 8 мест 12×3 м",
      type: "Хостблок",
      address: "Отправка по всей России",
      price: 890000,
      bedrooms: 4,
      bathrooms: 2,
      squareFeet: 36,
      yearBuilt: 2024,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
      dimensions: "12×3×2.7 м",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Каталог модульных строений</h1>
        <p className="text-muted-foreground">Бытовки, ночные домики и хостблоки на металлокаркасе собственного производства</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Поиск по типу, размеру или комплектации..." className="w-full pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1 sm:hidden">
            <SlidersHorizontal className="h-4 w-4" />
            Фильтры
          </Button>
          <Tabs defaultValue="grid" className="hidden sm:block">
            <TabsList>
              <TabsTrigger value="grid">
                <Grid2X2 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="map">
                <MapPin className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" className="h-9">
            Сначала новые
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="hidden lg:block">
          <SearchFilters />
        </div>
        <div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="outline">Загрузить ещё</Button>
          </div>
        </div>
      </div>
    </div>
  )
}