import { HttpTypes } from "@medusajs/types"

export type ProductWithStore = HttpTypes.StoreProduct & {
  store?: { id: string; name: string }
}

export function getProductStore(
  product: HttpTypes.StoreProduct
): { id: string; name: string } | undefined {
  return (product as ProductWithStore).store
}