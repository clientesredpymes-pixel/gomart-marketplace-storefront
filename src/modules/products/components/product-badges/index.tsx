import { clx } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import {
  getProductBadges,
  ProductBadgeKind,
} from "@lib/util/get-product-badges"

const badgeStyles: Record<ProductBadgeKind, string> = {
  "sold-out":
    "bg-ui-tag-neutral-bg text-ui-tag-neutral-text border-ui-tag-neutral-border",
  discount: "bg-ui-tag-red-bg text-ui-tag-red-text border-ui-tag-red-border",
  new: "bg-ui-tag-green-bg text-ui-tag-green-text border-ui-tag-green-border",
}

type ProductBadgesProps = {
  product: HttpTypes.StoreProduct
  className?: string
}

const ProductBadges = ({ product, className }: ProductBadgesProps) => {
  const badges = getProductBadges(product)

  if (badges.length === 0) {
    return null
  }

  return (
    <div
      className={clx(
        "absolute top-2 left-2 z-10 flex flex-col items-start gap-1 pointer-events-none",
        className
      )}
    >
      {badges.map((badge) => (
        <span
          key={badge.kind}
          className={clx(
            "px-1.5 py-0.5 rounded-base border text-[10px] font-semibold uppercase leading-none tracking-wide",
            badgeStyles[badge.kind]
          )}
        >
          {badge.label}
        </span>
      ))}
    </div>
  )
}

export default ProductBadges