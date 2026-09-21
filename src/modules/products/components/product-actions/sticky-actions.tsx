import { Transition } from "@headlessui/react"
import { Button, clx } from "@medusajs/ui"
import Image from "next/image"
import React, { Fragment, useMemo } from "react"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import OptionSelect from "./option-select"

type StickyActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  isValidVariant: boolean | undefined
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

/**
 * Barra flotante de compra (solo desktop): aparece cuando el bloque principal
 * de precio/Add-to-cart sale del viewport. Reutiliza el mismo estado, variante
 * y handlers que el bloque principal (no duplica lógica).
 */
const StickyActions: React.FC<StickyActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  isValidVariant,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    return variant ? variantPrice : cheapestPrice
  }, [variant, variantPrice, cheapestPrice])

  const initialImage = product.thumbnail || product.images?.[0]?.url || null

  return (
    <div
      className={clx("hidden lg:block inset-x-0 bottom-0 fixed z-50", {
        "pointer-events-none": !show,
      })}
    >
      <Transition
        as={Fragment}
        show={show}
        enter="ease-in-out duration-300"
        enterFrom="opacity-0 translate-y-full"
        enterTo="opacity-100 translate-y-0"
        leave="ease-in duration-300"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-full"
      >
        <div
          className="bg-white border-t border-gray-200 shadow-elevation-flyout"
          data-testid="sticky-actions"
        >
          <div className="content-container flex items-center gap-x-4 py-3">
            <div className="w-12 h-14 relative overflow-hidden rounded-base bg-ui-bg-subtle shrink-0">
              {initialImage && (
                <Image
                  src={initialImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="block truncate text-small-regular text-ui-fg-base">
                {product.title}
              </span>
              {selectedPrice ? (
                <div className="flex items-end gap-x-2 text-ui-fg-base">
                  {selectedPrice.price_type === "sale" && (
                    <p>
                      <span className="line-through text-ui-fg-muted text-[10px]">
                        {selectedPrice.original_price}
                      </span>
                    </p>
                  )}
                  <span
                    className={clx("text-base-semi", {
                      "text-ui-fg-interactive":
                        selectedPrice.price_type === "sale",
                    })}
                  >
                    {selectedPrice.calculated_price}
                  </span>
                </div>
              ) : (
                <div className="w-24 h-4 bg-gray-100 animate-pulse" />
              )}
            </div>

            {(product.variants?.length ?? 0) > 1 && (
              <div className="flex items-center gap-x-2 shrink-0">
                {(product.options || []).map((option) => (
                  <div
                    key={option.id}
                    className="flex flex-col gap-y-1"
                  >
                    <span className="text-[10px] text-ui-fg-muted">
                      {option.title}
                    </span>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={updateOptions}
                      title={option.title ?? ""}
                      disabled={optionsDisabled}
                      soldOutValues={undefined}
                      compact
                    />
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              disabled={
                !inStock ||
                !variant ||
                optionsDisabled ||
                isAdding ||
                !isValidVariant
              }
              variant="primary"
              className="h-10 shrink-0"
              isLoading={isAdding}
              data-testid="sticky-cart-button"
            >
              {!variant || !isValidVariant
                ? "Select variant"
                : !inStock
                ? "Out of stock"
                : "Add to cart"}
            </Button>
          </div>
        </div>
      </Transition>
    </div>
  )
}

export default StickyActions