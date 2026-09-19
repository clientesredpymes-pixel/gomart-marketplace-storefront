import { HttpTypes } from "@medusajs/types"

export const isVariantOutOfStock = (
  variant?: HttpTypes.StoreProductVariant | null
): boolean => {
  if (!variant) return false
  if (!variant.manage_inventory) return false
  if (variant.allow_backorder) return false
  return (variant.inventory_quantity ?? 0) <= 0
}

export const computeSoldOutOptionValues = ({
  product,
  selectedOptions,
}: {
  product: HttpTypes.StoreProduct
  selectedOptions?: Record<string, string | undefined>
}): Record<string, Set<string>> => {
  const result: Record<string, Set<string>> = {}

  if (!product.options || !product.variants) {
    return result
  }

  for (const option of product.options) {
    const soldOut = new Set<string>()

    for (const opt of option.values ?? []) {
      const candidates =
        product.variants.filter((variant) => {
          const valueOfOption = variant.options?.find(
            (o) => o.option_id === option.id
          )?.value

          if (valueOfOption !== opt.value) {
            return false
          }

          for (const [otherOptionId, selectedValue] of Object.entries(
            selectedOptions ?? {}
          )) {
            if (otherOptionId === option.id) {
              continue
            }
            if (!selectedValue) {
              continue
            }
            const otherValue = variant.options?.find(
              (o) => o.option_id === otherOptionId
            )?.value

            if (otherValue !== selectedValue) {
              return false
            }
          }

          return true
        }) ?? []

      if (candidates.length > 0 && candidates.every(isVariantOutOfStock)) {
        soldOut.add(opt.value)
      }
    }

    result[option.id] = soldOut
  }

  return result
}