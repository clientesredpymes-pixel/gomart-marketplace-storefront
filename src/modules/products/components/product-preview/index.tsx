import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductStore } from "@lib/util/get-product-store"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  const store = getProductStore(product)

  return (
    <div className="group">
      <LocalizedClientLink href={`/products/${product.handle}`}>
        <div data-testid="product-wrapper">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          <div className="flex txt-compact-medium mt-4 justify-between">
            <Text className="text-ui-fg-subtle" data-testid="product-title">
              {product.title}
            </Text>
            <div className="flex items-center gap-x-2">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
        </div>
      </LocalizedClientLink>
      {store && (
        <LocalizedClientLink
          href={`/store?store_id=${store.id}`}
          className="mt-1 flex txt-compact text-ui-fg-muted hover:text-ui-fg-subtle"
        >
          <span>Vendido por: </span>
          <span className="underline underline-offset-2 ml-0.5">
            {store.name}
          </span>
        </LocalizedClientLink>
      )}
    </div>
  )
}
