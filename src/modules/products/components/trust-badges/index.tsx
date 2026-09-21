import React from "react"

import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import Shield from "@modules/common/icons/shield"
import Support from "@modules/common/icons/support"

type TrustItem = {
  icon: React.ReactNode
  title: string
  body: string
}

const trustItems: TrustItem[] = [
  {
    icon: <FastDelivery size="24" />,
    title: "Envío rápido",
    body: "Envíos ágiles en Barranquilla y alrededores.",
  },
  {
    icon: <Shield size="24" />,
    title: "Pago 100% seguro",
    body: "Tus pagos se procesan de forma cifrada y protegida.",
  },
  {
    icon: <Refresh size="24" />,
    title: "Cambios y devoluciones",
    body: "¿No te quedó bien? Cambios y devoluciones sin complicaciones.",
  },
  {
    icon: <Support size="24" />,
    title: "Atención directa",
    body: "Resuelve tus dudas hablando directo con la tienda.",
  },
]

/**
 * Bloque de confianza del detalle de producto: fila horizontal de 4 columnas
 * en desktop, apiladas verticalmente en mobile. Texto centrado con ícono
 * pequeño arriba. Lenguaje genérico, sin promesas operativas no confirmadas.
 */
const TrustBadges: React.FC = () => {
  return (
    <section
      className="content-container border-t border-ui-border-base mt-12 small:mt-16 mb-16 small:mb-32 pt-10 small:pt-14"
      data-testid="trust-badges"
    >
      <div className="grid grid-cols-1 small:grid-cols-4 gap-x-6 gap-y-10">
        {trustItems.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center gap-y-2 text-center"
          >
            <span className="text-ui-fg-base">{item.icon}</span>
            <span className="text-small-semi text-ui-fg-base">
              {item.title}
            </span>
            <p className="text-small-regular text-ui-fg-muted max-w-[220px]">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrustBadges