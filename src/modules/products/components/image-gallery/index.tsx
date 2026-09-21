"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import ProductBadges from "../product-badges"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  product: HttpTypes.StoreProduct
}

/**
 * Galería de producto estilo "Seven Seven":
 * - Miniaturas clicables a la izquierda (desktop) / hilera (mobile)
 * - Imagen principal grande con zoom al hover (scale) y al click (lightbox)
 */
const ImageGallery = ({ images, product }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!images || images.length === 0) {
    return null
  }

  const activeImage = images[Math.min(activeIndex, images.length - 1)]

  return (
    <div className="flex items-start relative w-full">
      {/* --- Miniaturas (columna izq desktop / hilera mobile) --- */}
      {images.length > 1 && (
        <div className="flex flex-row small:flex-col gap-2 small:gap-y-3 mr-4 small:mr-0 flex-wrap small:flex-nowrap">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver imagen ${index + 1}`}
              className={`relative h-20 w-16 small:h-24 small:w-20 shrink-0 overflow-hidden rounded-rounded border transition-all ${
                index === activeIndex
                  ? "border-ui-fg-base ring-2 ring-ui-fg-subtle"
                  : "border-ui-border-base opacity-70 hover:opacity-100"
              }`}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  alt={`Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* --- Imagen principal con zoom --- */}
      <div className="flex flex-col flex-1 small:mx-auto gap-y-4">
        <Container
          className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle group cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        >
          <ProductBadges product={product} />
          {!!activeImage?.url && (
            <Image
              src={activeImage.url}
              priority
              className="absolute inset-0 rounded-rounded transition-transform duration-500 ease-out group-hover:scale-125"
              alt={`Product image ${activeIndex + 1}`}
              fill
              sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
              style={{
                objectFit: "cover",
              }}
            />
          )}
        </Container>
      </div>

      {/* --- Lightbox zoom --- */}
      {lightboxOpen && activeImage?.url && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 cursor-zoom-out"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada de la imagen"
        >
          <div className="relative">
            <Image
              src={activeImage.url}
              alt={`Product image ${activeIndex + 1} ampliada`}
              width={1600}
              height={1900}
              className="max-h-[85vh] max-w-[90vw] rounded-rounded object-contain"
              sizes="90vw"
            />
          </div>
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 text-white text-2xl leading-none flex items-center justify-center hover:bg-white/20"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
