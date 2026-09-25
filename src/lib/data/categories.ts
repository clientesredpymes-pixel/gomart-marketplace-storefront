import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

export const CATEGORIES_PAGE_SIZE = 100

/**
 * The /store/product-categories endpoint paginates (50 per page by default),
 * so a single call never returns the full catalog. This walks the pages until
 * every category is collected.
 */
export const listAllCategories = async (
  query?: Record<string, any>
): Promise<HttpTypes.StoreProductCategory[]> => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const isPaginatedRequest =
    query?.limit !== undefined || query?.offset !== undefined

  const limit = query?.limit || CATEGORIES_PAGE_SIZE
  const offset = query?.offset || 0
  const fields = query?.fields ?? "*category_children, *parent_category"

  const fetchPage = async (pageOffset: number) =>
    sdk.client.fetch<{
      product_categories: HttpTypes.StoreProductCategory[]
      count: number
    }>("/store/product-categories", {
      query: isPaginatedRequest
        ? { fields, limit, offset, ...query }
        : { fields, limit, offset: pageOffset },
      next,
      cache: "force-cache",
    })

  const first = await fetchPage(offset)
  const categories = [...first.product_categories]

  if (isPaginatedRequest) {
    return categories
  }

  let total = first.count

  while (categories.length < total) {
    const res = await fetchPage(categories.length)

    if (!res.product_categories?.length) {
      break
    }

    categories.push(...res.product_categories)
    total = res.count ?? total
  }

  return categories
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
