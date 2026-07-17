/** Shown wherever a category has no artwork of its own. */
export const CATEGORY_IMAGE_FALLBACK = "/placeholder.svg"

/**
 * The ERP returns a sentinel graphic (`no_image.png`) rather than an empty
 * field when a category has no artwork, so it has to be filtered out by name —
 * otherwise every imageless category renders the ERP's own "no image" file.
 */
export const isRealImage = (image?: string) => !!image && !/no_image/i.test(image)
