import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Icon from "@/components/ui/icon"

interface Property {
  id: string
  title: string
  type: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  yearBuilt: number
  status: string
  imageUrl: string
  dimensions?: string
}

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
      case "доступно":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "pending":
      case "бронь":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
      case "sold":
      case "продано":
        return "bg-red-100 text-red-800 hover:bg-red-100/80"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
    }
  }

  return (
    <Link to={`/properties/${property.id}`} className="flex">
      <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md w-full">
        {/* Фото 4:3 */}
        <div className="relative w-full overflow-hidden" style={{ paddingTop: "75%" }}>
          <img
            src={property.imageUrl || "/placeholder.svg"}
            alt={property.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105"
          />
          <Badge className={`absolute right-2 top-2 ${getStatusColor(property.status)}`} variant="outline">
            {property.status}
          </Badge>
        </div>
        <CardContent className="flex flex-col flex-1 p-4">
          {/* Название — 2 строки, выровнено по высоте */}
          <h3 className="font-semibold text-base leading-snug mb-2 line-clamp-2 min-h-[2.75rem]">
            {property.title}
          </h3>
          <p className="font-bold text-xl mt-auto">{formatPrice(property.price)}</p>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Icon name="Square" size={15} className="text-muted-foreground shrink-0" />
              <span className="text-sm">{property.squareFeet} м²</span>
            </div>
            {property.dimensions && (
              <div className="flex items-center gap-1.5">
                <Icon name="Ruler" size={15} className="text-muted-foreground shrink-0" />
                <span className="text-sm">{property.dimensions}</span>
              </div>
            )}
          </div>
          <Badge variant="outline" className="shrink-0 ml-2">{property.type}</Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}
