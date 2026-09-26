import { listAllCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listAllCategories({
    fields: "*category_children, *parent_category, *products",
  })

  const categoryRoots = productCategories.filter((c) => !c.parent_category)
  const categoryChildrenOf = (id: string) =>
    productCategories.filter((c) => c.parent_category?.id === id)

  const productCount = (c: { products?: unknown[] | null }) => c.products?.length ?? 0

  // Only surface groups that actually have products behind them, biggest first.
  // Today that is just "Ropa"; the footer grows by itself as the catalog fills.
  const MAX_FOOTER_GROUPS = 8

  const groupsWithStock = categoryRoots
    .map((root) => {
      // Only leaves that actually have products: a link to an empty category
      // page is a dead end, so we never render one.
      const populatedChildren = categoryChildrenOf(root.id).filter(
        (child) => productCount(child) > 0
      )
      const ownProducts = productCount(root)
      const total =
        populatedChildren.reduce((acc, child) => acc + productCount(child), 0) +
        ownProducts

      return { root, children: populatedChildren, ownProducts, total }
    })
    .filter((g) => g.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, MAX_FOOTER_GROUPS)

  const footerGroups = groupsWithStock.length
    ? groupsWithStock
    : // No product has a category yet: keep the footer from rendering empty.
      categoryRoots
        .map((root) => ({
          root,
          children: categoryChildrenOf(root.id),
          ownProducts: 0,
          total: 0,
        }))
        .sort((a, b) => b.children.length - a.children.length)
        .slice(0, MAX_FOOTER_GROUPS)

  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-40">
          <div>
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
            >
              GoMart Marketplace
            </LocalizedClientLink>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Categories
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  <li>
                    <LocalizedClientLink
                      className="hover:text-ui-fg-base txt-small-plus"
                      href="/categories"
                      data-testid="footer-all-categories-link"
                    >
                      Ver todas las categorías
                    </LocalizedClientLink>
                  </li>
                  {footerGroups.map(({ root, children, ownProducts }) => {
                    // Parents stay non-clickable (Medusa's category_id filter
                    // does exact matching, so a parent link renders nothing).
                    // Exception: a parent holding products of its own is not an
                    // empty grouping, so that one is linked.
                    const parentHoldsOwnProducts =
                      ownProducts > 0 && children.length === 0

                    return (
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                        key={root.id}
                        data-testid="footer-category-group"
                      >
                        {parentHoldsOwnProducts ? (
                          <LocalizedClientLink
                            className="txt-small-plus hover:text-ui-fg-base"
                            href={`/categories/${root.handle}`}
                            data-testid="footer-category-title"
                          >
                            {root.name}
                          </LocalizedClientLink>
                        ) : (
                          <span
                            className="txt-small-plus text-ui-fg-base"
                            data-testid="footer-category-title"
                          >
                            {root.name}
                          </span>
                        )}
                        {children.length > 0 && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
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
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Collections
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small",
                    {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    }
                  )}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base">Medusa</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <a
                    href="https://github.com/medusajs"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.medusajs.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/medusajs/nextjs-starter-medusa"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Source code
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-16 justify-between text-ui-fg-muted">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} GoMart Marketplace. Todos los derechos
            reservados.
          </Text>
          <MedusaCTA />
        </div>
      </div>
    </footer>
  )
}
