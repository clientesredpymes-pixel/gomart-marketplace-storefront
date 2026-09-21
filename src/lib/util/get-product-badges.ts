import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "./get-product-price"
import { isVariantOutOfStock } from "./variant-stock"

export type ProductBadgeKind = "discount" | "new" | "sold-out"

export type ProductBadge = {
  kind: ProductBadgeKind
  label: string
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const NEW_PRODUCT_DAYS = 14

const isProductNew = (createdAt?: string | null): boolean => {
  if (!createdAt) {
    return false
  }

  const created = new Date(createdAt).getTime()

  if (Number.isNaN(created)) {
    return false
  }

  return Date.now() - created < NEW_PRODUCT_DAYS * DAY
}

/**
 * Devuelve los badges a superponer sobre la imagen del producto, en orden de
 * apilado: "Agotado" arriba (prioridad visual), luego descuento y luego nuevo.
 */
export function getProductBadges(
  product: HttpTypes.StoreProduct
): ProductBadge[] {
  const badges: ProductBadge[] = []

  const allSoldOut =
    !!product.variants?.length && product.variants.every(isVariantOutOfStock)

  if (allSoldOut) {
    badges.push({ kind: "sold-out", label: "Agotado" })
  }

  const { cheapestPrice } = getProductPrice({ product })
  const original = cheapestPrice?.original_price_number
  const calculated = cheapestPrice?.calculated_price_number

  if (
    typeof original === "number" &&
    typeof calculated === "number" &&
    original > 0 &&
    calculated > 0 &&
    original > calculated
  ) {
    const percentage = Math.round(((original - calculated) / original) * 100)
    badges.push({ kind: "discount", label: `-${percentage}%` })
  }

  if (isProductNew(product.created_at)) {
    badges.push({ kind: "new", label: "Nuevo" })
  }

  return badges
}