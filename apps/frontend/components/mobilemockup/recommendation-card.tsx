import Image from "next/image"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecommendationCardProps {
  title: string
  artist: string
  imageUrl: string
}

export default function RecommendationCard({ title, artist, imageUrl }: RecommendationCardProps) {
  return (
    <div className="relative group">
      <div className="rounded-lg overflow-hidden bg-[#2d0f4c] p-2">
        <div className="relative">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            width={150}
            height={150}
            className="w-full aspect-square object-cover rounded-md"
          />
          <Button
            size="icon"
            className="absolute bottom-2 right-2 rounded-full bg-purple-600 hover:bg-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="h-4 w-4" fill="white" />
          </Button>
        </div>
        <div className="mt-2">
          <h3 className="font-medium truncate">{title}</h3>
          <p className="text-sm text-purple-300 truncate">{artist}</p>
        </div>
      </div>
    </div>
  )
}

