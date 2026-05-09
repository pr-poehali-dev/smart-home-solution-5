import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Bed, Bath, Square, MapPin } from "lucide-react"

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
    <Link to={`/properties/${property.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={property.imageUrl || "/placeholder.svg"}
            alt={property.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
          <Badge className={`absolute right-2 top-2 ${getStatusColor(property.status)}`} variant="outline">
            {property.status}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-xl">{property.title}</h3>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-1 h-3.5 w-3.5" />
              <span className="text-sm">{property.address}</span>
            </div>
            <p className="font-bold text-xl">{formatPrice(property.price)}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{property.squareFeet} м2</span>
            </div>
          </div>
          <Badge variant="outline">{property.type}</Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}
