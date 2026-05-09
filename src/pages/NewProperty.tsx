import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ChevronRight, Upload, X } from "lucide-react"

export default function NewPropertyPage() {
  const [images, setImages] = useState<string[]>([])
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Объявление успешно создано!")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 hover:text-foreground">
          <Home className="h-4 w-4" />
          Главная
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/properties" className="hover:text-foreground">
          Объекты
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Новое объявление</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Разместить объявление</h1>
        <p className="text-muted-foreground">Заполните форму ниже, чтобы добавить ваш объект</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Информация об объекте</CardTitle>
              <CardDescription>Основные характеристики недвижимости</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Название объявления</Label>
                <Input id="title" placeholder="например, Современная квартира в центре" required />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Тип недвижимости</Label>
                  <Select required>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">Дом</SelectItem>
                      <SelectItem value="apartment">Квартира</SelectItem>
                      <SelectItem value="condo">Апартаменты</SelectItem>
                      <SelectItem value="townhouse">Таунхаус</SelectItem>
                      <SelectItem value="land">Участок</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Статус</Label>
                  <Select required>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Доступно</SelectItem>
                      <SelectItem value="pending">Бронь</SelectItem>
                      <SelectItem value="sold">Продано</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Цена (руб.)</Label>
                <Input id="price" type="number" min="0" step="100000" required />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Комнат</Label>
                  <Input id="bedrooms" type="number" min="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Санузлов</Label>
                  <Input id="bathrooms" type="number" min="0" step="1" required />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="squareFeet">Площадь (м2)</Label>
                  <Input id="squareFeet" type="number" min="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearBuilt">Год постройки</Label>
                  <Input id="yearBuilt" type="number" min="1900" max={new Date().getFullYear()} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea id="description" placeholder="Опишите ваш объект..." className="min-h-[150px]" required />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Расположение</CardTitle>
                <CardDescription>Где находится ваш объект?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="street">Адрес</Label>
                  <Input id="street" required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">Город</Label>
                    <Input id="city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Район/Область</Label>
                    <Input id="state" required />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="zip">Индекс</Label>
                    <Input id="zip" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Страна</Label>
                    <Input id="country" defaultValue="Россия" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
                <CardDescription>Как с вами связаться?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Контактное лицо</Label>
                  <Input id="contactName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input id="contactEmail" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Телефон</Label>
                  <Input id="contactPhone" type="tel" required />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Фотографии</CardTitle>
              <CardDescription>Загрузите фото объекта (до 10 штук)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label
                  htmlFor="images"
                  className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-input bg-muted/50 px-4 py-5 text-center"
                >
                  <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold">Нажмите для загрузки</span> или перетащите файлы
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG или WEBP (макс. 5 МБ на изображение)</p>
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={handleImageUpload}
                    disabled={images.length >= 10}
                  />
                </Label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Фото ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-1 top-1 rounded-full bg-background p-1 shadow-sm"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Удобства</CardTitle>
              <CardDescription>Выберите все, что есть в вашем объекте</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Link to="/properties">
            <Button variant="outline">Отмена</Button>
          </Link>
          <Button type="submit">Опубликовать</Button>
        </div>
      </form>
    </div>
  )
}
