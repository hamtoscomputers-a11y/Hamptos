import { useState } from "react"
import { Star } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSubmitProductReview } from "@/api/hooks/useProducts"
import { toast } from "@/hooks/use-toast"

interface WriteReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  productName?: string
}

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"]

/**
 * The star picker. A radio group underneath, so the rating is keyboard
 * reachable and announced — five clickable icons alone would be neither.
 */
const StarPicker = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => {
  const [hovered, setHovered] = useState(0)
  const shown = hovered || value

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((level) => (
          <label
            key={level}
            className="cursor-pointer p-0.5"
            onMouseEnter={() => setHovered(level)}
            title={`${level} ${level === 1 ? "star" : "stars"}`}
          >
            <input
              type="radio"
              name="rating"
              value={level}
              checked={value === level}
              onChange={() => onChange(level)}
              className="sr-only peer"
            />
            <Star
              size={26}
              fill="currentColor"
              strokeWidth={0}
              className={`transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-review-star ${
                level <= shown ? "text-review-star" : "text-surface-mist"
              }`}
            />
            <span className="sr-only">
              {level} {level === 1 ? "star" : "stars"}
            </span>
          </label>
        ))}
      </div>
      {shown > 0 && <span className="text-[13px] text-review-meta">{RATING_LABELS[shown]}</span>}
    </div>
  )
}

/**
 * "Write a review" — the form behind the link in the Customer Reviews heading.
 *
 * Submissions are queued for approval in the ERP rather than published, so the
 * confirmation says so instead of implying the review is already on the page.
 */
const WriteReviewDialog = ({ open, onOpenChange, productId, productName }: WriteReviewDialogProps) => {
  const [rating, setRating] = useState(0)
  const [author, setAuthor] = useState("")
  const [email, setEmail] = useState("")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [error, setError] = useState<string | null>(null)

  const { mutate, isPending } = useSubmitProductReview()

  const reset = () => {
    setRating(0)
    setAuthor("")
    setEmail("")
    setTitle("")
    setBody("")
    setError(null)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    // Checked here as well as in the ERP so the obvious mistakes cost no round
    // trip; the ERP validates regardless, since this form is not the only way
    // to reach the endpoint.
    if (!rating) {
      setError("Please choose a rating.")
      return
    }
    if (author.trim().length < 2) {
      setError("Please tell us your name.")
      return
    }

    setError(null)
    mutate(
      {
        product_id: productId,
        rating,
        author: author.trim(),
        email: email.trim() || undefined,
        title: title.trim() || undefined,
        body: body.trim() || undefined,
      },
      {
        onSuccess: (response) => {
          toast({
            title: "Thank you for your review",
            description: response?.message ?? "It will appear once it has been approved.",
          })
          reset()
          onOpenChange(false)
        },
        onError: (submitError: any) => {
          // The ERP's own wording where it has an opinion — "You have already
          // reviewed this product" is more use than a generic failure.
          setError(
            submitError?.response?.data?.message ??
              "Your review could not be submitted. Please try again in a moment.",
          )
        },
      },
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setError(null)
        onOpenChange(next)
      }}
    >
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-medium text-black">Write a review</DialogTitle>
          <DialogDescription>
            {productName ? `Share your experience with ${productName}.` : "Share your experience with this product."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>
              Rating <span className="text-destructive">*</span>
            </Label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="review-author">
                Your name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="review-author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                maxLength={100}
                autoComplete="name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-email">Email</Label>
              <Input
                id="review-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={150}
                autoComplete="email"
              />
              {/* Why it is worth giving: it is what earns the badge. Never
                  published — the ERP keeps it for moderation only. */}
              <p className="text-[11px] text-review-meta">
                Not shown publicly. Used to mark you as a verified buyer.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-title">Headline</Label>
            <Input
              id="review-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={150}
              placeholder="Sums up your review in a few words"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-body">Your review</Label>
            <Textarea
              id="review-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={2000}
              rows={5}
              placeholder="What did you like or dislike? How did you use it?"
            />
            <p className="text-[11px] text-review-meta">{body.length}/2000</p>
          </div>

          {error && (
            <p role="alert" className="text-[13px] text-destructive">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting…" : "Submit review"}
            </Button>
          </div>

          <p className="text-[11px] text-review-meta">
            Reviews are checked before they are published, so yours will not appear straight away.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default WriteReviewDialog
