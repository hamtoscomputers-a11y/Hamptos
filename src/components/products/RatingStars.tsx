import { Star } from "lucide-react"

interface RatingStarsProps {
  /** 0-5. Fractional values clip the last star, as the Figma draws it. */
  rating: number
  /** Edge length of one star, in px. */
  size?: number
  className?: string
}

const RatingStars = ({ rating, size = 14, className = "" }: RatingStarsProps) => {
  const box = { width: size, height: size }

  return (
    <span className={`flex items-center ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((index) => {
        const fill = Math.max(0, Math.min(1, rating - index))

        return (
          <span key={index} className="relative flex-shrink-0" style={box}>
            <Star className="absolute text-surface-line" style={box} fill="currentColor" />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="text-ink" style={box} fill="currentColor" />
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}

export default RatingStars
