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
      title: "Современная квартира в центре",
      type: "Квартира",
      address: "ул. Тверская, 15, Москва",
      price: 18500000,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 75,
      yearBuilt: 2020,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "2",
      title: "Загородный дом с участком",
      type: "Дом",
      address: "КП Лесной, Московская область",
      price: 35000000,
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 220,
      yearBuilt: 2018,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "3",
      title: "Апартаменты с видом на реку",
      type: "Апартаменты",
      address: "Пресненская наб., 8, Москва-Сити",
      price: 52000000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 145,
      yearBuilt: 2022,
      status: "Бронь",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "4",
      title: "Таунхаус в историческом районе",
      type: "Таунхаус",
      address: "Патриаршие пруды, Москва",
      price: 85000000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 180,
      yearBuilt: 2015,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "5",
      title: "Уютный дом у леса",
      type: "Дом",
      address: "КП Сосны, Одинцовский район",
      price: 28000000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 160,
      yearBuilt: 2019,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "6",
      title: "Пентхаус с панорамным видом",
      type: "Апартаменты",
      address: "Кутузовский проспект, 32, Москва",
      price: 120000000,
      bedrooms: 5,
      bathrooms: 3,
      squareFeet: 350,
      yearBuilt: 2021,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Каталог недвижимости</h1>
        <p className="text-muted-foreground">Найдите идеальный дом среди наших предложений</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Поиск по адресу, названию или ключевым словам..." className="w-full pl-9" />
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
