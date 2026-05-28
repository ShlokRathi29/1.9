"use client"

import { 
  Dumbbell, 
  Waves, 
  TreePine, 
  Car, 
  PlayCircle, 
  Users,
  Flower2,
  Building,
  Gamepad2,
  CircleDot,
  Trophy,
  Bike
} from "lucide-react"

interface Amenity {
  name: string
  icon: string
}

interface AmenitiesProps {
  projectName: string
  amenities: Amenity[]
}

const iconMap: Record<string, React.ReactNode> = {
  "basketball": <Trophy className="h-5 w-5" />,
  "gymnasium": <Dumbbell className="h-5 w-5" />,
  "indoor-games": <Gamepad2 className="h-5 w-5" />,
  "swimming": <Waves className="h-5 w-5" />,
  "yoga": <Users className="h-5 w-5" />,
  "cricket": <CircleDot className="h-5 w-5" />,
  "jogging": <Bike className="h-5 w-5" />,
  "community": <Building className="h-5 w-5" />,
  "tennis": <Trophy className="h-5 w-5" />,
  "play-area": <PlayCircle className="h-5 w-5" />,
  "volleyball": <Trophy className="h-5 w-5" />,
  "kids-pool": <Waves className="h-5 w-5" />,
  "garden": <Flower2 className="h-5 w-5" />,
  "squash": <Trophy className="h-5 w-5" />,
  "lawn": <TreePine className="h-5 w-5" />,
  "pool-deck": <Waves className="h-5 w-5" />,
  "senior": <Users className="h-5 w-5" />,
  "skating": <CircleDot className="h-5 w-5" />,
}

export function Amenities({ projectName, amenities }: AmenitiesProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">{projectName} Amenities</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {amenities.map((amenity, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
          >
            <div className="text-gray-400">
              {iconMap[amenity.icon] || <Building className="h-5 w-5" />}
            </div>
            <span className="text-sm text-gray-700">{amenity.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500">
          <span className="font-medium text-gray-700">Gymnasium:</span> A state-of-the-art fitness centre equipped with modern machines and personalized training assists to meet all your fitness goals. Enjoy a health-focused lifestyle with access to expert guidance and wellness programs. Indoor Games - Enjoy your round sports with indoor courts for badminton, games &...
        </p>
      </div>
    </div>
  )
}
