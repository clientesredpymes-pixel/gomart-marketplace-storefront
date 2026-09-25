import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    store_id?: string
    category_id?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, store_id, category_id } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      storeId={store_id}
      categoryId={category_id}
      countryCode={params.countryCode}
    />
  )
}
