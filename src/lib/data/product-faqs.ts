export type ProductFaq = {
  question: string
  answer: string
}

/**
 * FAQs genéricas que aplican a todos los productos del storefront.
 * Vivirán aquí (no en el componente) para que más adelante se puedan definir
 * FAQs específicas por producto o categoría sin tocar el componente.
 * Lenguaje genérico de confianza, sin promesas operativas no confirmadas.
 */
export const productFaqs: ProductFaq[] = [
  {
    question: "¿Cómo se realizan los envíos?",
    answer:
      "Los envíos se coordinan directamente con la tienda una vez confirmado tu pedido. Nuestra tienda está en Barranquilla y despachamos a la ciudad y sus alrededores.",
  },
  {
    question: "¿Puedo cambiar o devolver un producto?",
    answer:
      "Sí. Hacemos cambios y devoluciones de forma sencilla: si algo no te quedó bien, coordinamos contigo el cambio o la devolución sin complicaciones.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Puedes pagar de forma 100% segura con los métodos disponibles al finalizar tu compra. Si tienes dudas, la tienda te confirma las opciones al momento de tu pedido.",
  },
  {
    question: "¿Cómo contacto a la tienda?",
    answer:
      "Puedes contactar a la tienda directo desde la página de inicio o al cerrar tu compra; el equipo te atiende para resolver tus dudas.",
  },
]