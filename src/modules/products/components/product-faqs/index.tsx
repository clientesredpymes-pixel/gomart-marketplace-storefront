import ChevronDown from "@modules/common/icons/chevron-down"
import Accordion from "@modules/products/components/product-tabs/accordion"
import { productFaqs, ProductFaq } from "@lib/data/product-faqs"

type ProductFaqsProps = {
  faqs?: ProductFaq[]
}

/**
 * Sección de preguntas frecuentes del detalle de producto. Acordeón clásico
 * (una sola pregunta abierta a la vez), data-driven: recibe las FAQs por prop
 * y por defecto usa las genéricas de src/lib/data/product-faqs.ts.
 */
const ProductFaqs: React.FC<ProductFaqsProps> = ({ faqs = productFaqs }) => {
  return (
    <section
      className="content-container mt-12 small:mt-16 mb-16 small:mb-32"
      data-testid="product-faqs"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-large-semi text-ui-fg-base text-center mb-8">
          Preguntas frecuentes
        </h2>
        <Accordion type="single" collapsible>
          {faqs.map((faq) => (
            <Accordion.Item
              key={faq.question}
              title={faq.question}
              headingSize="medium"
              value={faq.question}
              customTrigger={
                <span className="text-ui-fg-base transition-transform duration-300 group-radix-state-open:rotate-180">
                  <ChevronDown />
                </span>
              }
            >
              <p className="text-small-regular text-ui-fg-muted">
                {faq.answer}
              </p>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export default ProductFaqs