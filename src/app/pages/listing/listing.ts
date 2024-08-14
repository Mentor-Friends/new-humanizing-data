import topNavigation from "../../modules/top-nav/top-navigation";
import { initiateListing, getProducts } from "./listing.service";

const prouductList = await getProducts()

async function onLoad () {
  await initiateListing()
  return `
    ${topNavigation}
    <section class="py-8">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="font-manrope font-bold text-4xl text-black mb-8 max-lg:text-center">
        Product list
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" id="product-listings">
        ${prouductList}
      </div>
    </div>
  </section>
  `
}

export const listingHTML: any = await onLoad()
