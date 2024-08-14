import topNavigation from "../../modules/top-nav/top-navigation";
import { getProductDetails } from "./listItem.service";

export default async function onlistItemLoad() {
  let productId: any = window?.location?.href?.split("/")?.reverse()?.[0];
  if (!(Number(productId) > 0)) productId = 1;
  const productDetails = await getProductDetails(Number(productId));

  return `
  ${topNavigation}
  <section class="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
    <div class="max-w-screen-xl px-4 mx-auto 2xl:px-0">
      <div class="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16" id="list-item">
        ${productDetails}
      </div>
    </div>
  </section>
`;
}

