import { Metadata } from "next"

import { listAllCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Categorías",
  description: "Explora todas las categorías de la tienda.",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function CategoriesIndexPage(props: Props) {
  const params = await props.params
  const categories = await listAllCategories()

  const roots = categories.filter(
    (c: HttpTypes.StoreProductCategory) => !c.parent_category
  )

  const childrenOf = (id: string) =>
    categories.filter(
      (c: HttpTypes.StoreProductCategory) => c.parent_category?.id === id
    )

  const orphanLeaves = categories.filter(
    (c: HttpTypes.StoreProductCategory) => c.parent_category
  ).filter(
    (c: HttpTypes.StoreProductCategory) =>
      !roots.some((r) => r.id === c.parent_category?.id)
  )

  return (
    <div className="content-container py-6 flex flex-col gap-y-10">
      <div className="flex flex-col gap-y-2">
        <h1
          className="text-2xl-semi"
          data-testid="categories-index-title"
        >
          Categorías
        </h1>
        <p className="text-base-regular text-ui-fg-subtle">
          Elegí una subcategoría para ver sus productos.
        </p>
      </div>

      <div
        className="grid grid-cols-1 medium:grid-cols-2 large:grid-cols-3 gap-x-8 gap-y-8"
        data-testid="categories-index-groups"
      >
        {roots.map((root) => {
          const children = childrenOf(root.id)

          return (
            <div
              key={root.id}
              className="flex flex-col gap-y-2"
              data-testid="category-group"
            >
              <span
                className="txt-small-plus txt-ui-fg-base"
                data-testid="category-group-title"
              >
                {root.name}
              </span>
              {children.length > 0 ? (
                <ul className="grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small">
                  {children.map((child) => (
                    <li key={child.id}>
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base"
                        href={`/categories/${child.handle}`}
                        data-testid="category-link"
                      >
                        {child.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-ui-fg-subtle txt-small">
                  Sin subcategorías
                </span>
              )}
            </div>
          )
        })}
      </div>

      {orphanLeaves.length > 0 && (
        <div
          className="flex flex-col gap-y-2"
          data-testid="categories-orphans"
        >
          <span className="txt-small-plus txt-ui-fg-base">
            Otras categorías
          </span>
          <ul className="grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small">
            {orphanLeaves.map((child) => (
              <li key={child.id}>
                <LocalizedClientLink
                  className="hover:text-ui-fg-base"
                  href={`/categories/${child.handle}`}
                  data-testid="category-link"
                >
                  {child.name}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
