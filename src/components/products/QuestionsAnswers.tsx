import { useProductQuestions } from "@/api/hooks/useProducts"

interface QaItem {
  question: string
  answer: string
}

interface QuestionsAnswersProps {
  /** Whose Q&A to show. Without it the section renders nothing. */
  productId?: string
  /** Kept for the callers that pass them; not used for content any more. */
  name?: string
  code?: string
  /** Overrides the ERP's entries. Used by stories and tests, not by the page. */
  items?: QaItem[]
}

/** Q in #8A8A8A, A in #000000, both lettered in white. */
const Marker = ({ letter }: { letter: "Q" | "A" }) => (
  <span
    aria-hidden
    // 2px centres the 14px disc on the 18px line.
    className={`mt-0.5 flex h-[14px] w-[14px] flex-shrink-0 items-center justify-center rounded-full text-[8px] font-semibold leading-none text-white ${
      letter === "Q" ? "bg-ink-ash" : "bg-black"
    }`}
  >
    {letter}
  </span>
)

/**
 * "Questions & Answers", per the Figma's blocks at x212:
 *
 *   heading  28 / 28.9 / -2%  #000000
 *   entry    1303 x 100, gap 8, 1px #000000 at 50% top and bottom
 *
 * Stacked entries would double the Figma's top-and-bottom rules where they
 * meet, so the rule above the first sits on the list and each entry carries the
 * one beneath it — the same drawing, without the 2px seams.
 *
 * Content comes from the ERP under Products → Questions & Answers. A product
 * with none hides the section rather than showing the three templated questions
 * this used to generate from the product's name: those were the same three on
 * every product in the catalogue, and their answers asserted things about
 * accessories and setup that nobody had checked.
 */
const QuestionsAnswers = ({ productId, items }: QuestionsAnswersProps) => {
  const { data, isLoading } = useProductQuestions(productId ?? "")
  const entries = items?.length ? items : (data ?? [])

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-labelledby="questions-answers-heading">
      <h2
        id="questions-answers-heading"
        className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black"
      >
        Questions &amp; Answers
      </h2>

      {/* 7345 - 7322 = 23 between the heading and the first rule. */}
      {entries.length > 0 ? (
        <ul className="mt-[23px] border-t border-black/50">
          {entries.map((entry) => (
            // The pair sits at y28 in a 100-tall block and is 44.04 high, so it
            // is centred with 28 clear above and below. `min-h` rather than a
            // fixed height, since a question longer than the Figma's wraps.
            <li key={entry.question} className="flex min-h-[100px] items-center border-b border-black/50 py-7">
              {/* 764 in the Figma — not the full 1303. */}
              <div className="flex w-full max-w-[764px] flex-col gap-2">
                <p className="flex items-start gap-1.5 text-[12px] leading-[18px] text-black">
                  <Marker letter="Q" />
                  {entry.question}
                </p>
                <div className="flex items-start gap-1.5 text-[12px] leading-[18px] text-black">
                  <Marker letter="A" />
                  {/* Written in the ERP's rich-text editor, so it arrives as
                      markup. Filtered to an allowlist server-side before it is
                      sent. `[&>p:last-child]:mb-0` kills the trailing margin a
                      lone paragraph would otherwise add under the row. */}
                  <div
                    className="min-w-0 [&_a]:text-brand-700 [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-1.5 [&>p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{ __html: entry.answer }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-[23px] border-y border-black/50 py-8">
          <p className="text-[12px] text-ink-body">
            {isLoading && productId ? "Loading…" : "No data available."}
          </p>
        </div>
      )}
    </section>
  )
}

export default QuestionsAnswers
