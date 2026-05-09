import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Filter, X } from "lucide-react"

export function SearchFilters() {
  const [priceRange, setPriceRange] = useState([5000000, 50000000])
  const [bedroomsRange, setBedroomsRange] = useState([1, 5])
  const [bathroomsRange, setBathroomsRange] = useState([1, 4])
  const [squareFootageRange, setSquareFootageRange] = useState([30, 300])
  const [yearBuiltRange, setYearBuiltRange] = useState([1990, 2024])
  const [propertyTypes, setPropertyTypes] = useState({
    house: false,
    apartment: false,
    condo: false,
    townhouse: false,
    land: false,
  })
  const [amenities, setAmenities] = useState({
    pool: false,
    garage: false,
    garden: false,
    balcony: false,
    elevator: false,
    airConditioning: false,
    furnished: false,
    petFriendly: false,
  })
  const [status, setStatus] = useState({
    available: true,
    pending: false,
    sold: false,
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleReset = () => {
    setPriceRange([5000000, 50000000])
    setBedroomsRange([1, 5])
    setBathroomsRange([1, 4])
    setSquareFootageRange([30, 300])
    setYearBuiltRange([1990, 2024])
    setPropertyTypes({
      house: false,
      apartment: false,
      condo: false,
      townhouse: false,
      land: false,
    })
    setAmenities({
      pool: false,
      garage: false,
      garden: false,
      balcony: false,
      elevator: false,
      airConditioning: false,
      furnished: false,
      petFriendly: false,
    })
    setStatus({
      available: true,
      pending: false,
      sold: false,
    })
  }

  return (
    <div className="w-full rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Фильтры</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 gap-1">
          <X className="h-4 w-4" />
          Сбросить
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["price", "bedrooms", "propertyType", "status"]}>
        <AccordionItem value="price">
          <AccordionTrigger>Диапазон цен</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider value={priceRange} min={0} max={200000000} step={1000000} onValueChange={setPriceRange} />
              <div className="flex items-center justify-between">
                <div className="w-[120px]">
                  <Label htmlFor="price-min">Мин. цена</Label>
                  <Input id="price-min" type="text" value={formatPrice(priceRange[0])} readOnly />
                </div>
                <div className="w-[120px]">
                  <Label htmlFor="price-max">Макс. цена</Label>
                  <Input id="price-max" type="text" value={formatPrice(priceRange[1])} readOnly />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bedrooms">
          <AccordionTrigger>Комнат</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider value={bedroomsRange} min={0} max={10} step={1} onValueChange={setBedroomsRange} />
              <div className="flex items-center justify-between">
                <div className="w-[120px]">
                  <Label htmlFor="bedrooms-min">Мин. комнат</Label>
                  <Input id="bedrooms-min" type="number" value={bedroomsRange[0]} readOnly />
                </div>
                <div className="w-[120px]">
                  <Label htmlFor="bedrooms-max">Макс. комнат</Label>
                  <Input id="bedrooms-max" type="number" value={bedroomsRange[1]} readOnly />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bathrooms">
          <AccordionTrigger>Санузлов</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider value={bathroomsRange} min={0} max={10} step={1} onValueChange={setBathroomsRange} />
              <div className="flex items-center justify-between">
                <div className="w-[120px]">
                  <Label htmlFor="bathrooms-min">Мин.</Label>
                  <Input id="bathrooms-min" type="number" value={bathroomsRange[0]} readOnly />
                </div>
                <div className="w-[120px]">
                  <Label htmlFor="bathrooms-max">Макс.</Label>
                  <Input id="bathrooms-max" type="number" value={bathroomsRange[1]} readOnly />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="squareFootage">
          <AccordionTrigger>Площадь (м2)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider value={squareFootageRange} min={0} max={500} step={10} onValueChange={setSquareFootageRange} />
              <div className="flex items-center justify-between">
                <div className="w-[120px]">
                  <Label htmlFor="sqft-min">Мин. м2</Label>
                  <Input id="sqft-min" type="number" value={squareFootageRange[0]} readOnly />
                </div>
                <div className="w-[120px]">
                  <Label htmlFor="sqft-max">Макс. м2</Label>
                  <Input id="sqft-max" type="number" value={squareFootageRange[1]} readOnly />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="yearBuilt">
          <AccordionTrigger>Год постройки</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider value={yearBuiltRange} min={1950} max={2024} step={1} onValueChange={setYearBuiltRange} />
              <div className="flex items-center justify-between">
                <div className="w-[120px]">
                  <Label htmlFor="year-min">От года</Label>
                  <Input id="year-min" type="number" value={yearBuiltRange[0]} readOnly />
                </div>
                <div className="w-[120px]">
                  <Label htmlFor="year-max">До года</Label>
                  <Input id="year-max" type="number" value={yearBuiltRange[1]} readOnly />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="propertyType">
          <AccordionTrigger>Тип недвижимости</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-house"
                  checked={propertyTypes.house}
                  onCheckedChange={(checked) => setPropertyTypes({ ...propertyTypes, house: !!checked })}
                />
                <label
                  htmlFor="type-house"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Дом
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-apartment"
                  checked={propertyTypes.apartment}
                  onCheckedChange={(checked) => setPropertyTypes({ ...propertyTypes, apartment: !!checked })}
                />
                <label
                  htmlFor="type-apartment"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Квартира
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-condo"
                  checked={propertyTypes.condo}
                  onCheckedChange={(checked) => setPropertyTypes({ ...propertyTypes, condo: !!checked })}
                />
                <label
                  htmlFor="type-condo"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Апартаменты
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-townhouse"
                  checked={propertyTypes.townhouse}
                  onCheckedChange={(checked) => setPropertyTypes({ ...propertyTypes, townhouse: !!checked })}
                />
                <label
                  htmlFor="type-townhouse"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Таунхаус
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-land"
                  checked={propertyTypes.land}
                  onCheckedChange={(checked) => setPropertyTypes({ ...propertyTypes, land: !!checked })}
                />
                <label
                  htmlFor="type-land"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Участок
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="amenities">
          <AccordionTrigger>Удобства</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-pool"
                  checked={amenities.pool}
                  onCheckedChange={(checked) => setAmenities({ ...amenities, pool: !!checked })}
                />
                <label
                  htmlFor="amenity-pool"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Бассейн
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-garage"
                  checked={amenities.garage}
                  onCheckedChange={(checked) => setAmenities({ ...amenities, garage: !!checked })}
                />
                <label
                  htmlFor="amenity-garage"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Гараж
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-garden"
                  checked={amenities.garden}
                  onCheckedChange={(checked) => setAmenities({ ...amenities, garden: !!checked })}
                />
                <label
                  htmlFor="amenity-garden"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Сад
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-balcony"
                  checked={amenities.balcony}
                  onCheckedChange={(checked) => setAmenities({ ...amenities, balcony: !!checked })}
                />
                <label
                  htmlFor="amenity-balcony"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Балкон
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-elevator"
                  checked={amenities.elevator}
                  onCheckedChange={(checked) => setAmenities({ ...amenities, elevator: !!checked })}
                />
                <label
                  htmlFor="amenity-elevator"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Лифт
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-ac"
                  checked={amenities.airConditioning}
                  onCheckedChange={(checked) => setAmenities({ ...amenities, airConditioning: !!checked })}
                />
                <label
                  htmlFor="amenity-ac"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Кондиционер
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-furnished"
                  checked={amenities.furnished}
                  onCheckedChange={(checked) => setAmenities({ ...amenities, furnished: !!checked })}
                />
                <label
                  htmlFor="amenity-furnished"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  С мебелью
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-pet"
                  checked={amenities.petFriendly}
                  onCheckedChange={(checked) => setAmenities({ ...amenities, petFriendly: !!checked })}
                />
                <label
                  htmlFor="amenity-pet"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Можно с питомцами
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="status">
          <AccordionTrigger>Статус</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-available"
                  checked={status.available}
                  onCheckedChange={(checked) => setStatus({ ...status, available: !!checked })}
                />
                <label
                  htmlFor="status-available"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Доступно
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-pending"
                  checked={status.pending}
                  onCheckedChange={(checked) => setStatus({ ...status, pending: !!checked })}
                />
                <label
                  htmlFor="status-pending"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Бронь
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-sold"
                  checked={status.sold}
                  onCheckedChange={(checked) => setStatus({ ...status, sold: !!checked })}
                />
                <label
                  htmlFor="status-sold"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Продано
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6">
        <Button className="w-full">Применить фильтры</Button>
      </div>
    </div>
  )
}
