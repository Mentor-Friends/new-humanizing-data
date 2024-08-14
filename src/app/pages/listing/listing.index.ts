import mainViewClass from "../../default/mainView.class.ts";
import { initTopNavigation } from "../../modules/top-nav/top-navigation.service.ts";
import topNavigation from "../../modules/top-nav/top-navigation.ts";
import { getProducts } from "./listing.service.ts";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle("Listing Item");
  }

  async getHtml() {
    // let prouductList: any = ''
    // setTimeout(async () => {
    //   prouductList = await getProducts()
    // }, 100);
    // const prouductList = await getProducts()

    setTimeout(async () => {
      await getProducts();
    }, 100);

    setTimeout(() => {
      initTopNavigation();
    }, 500);

    return `
      ${topNavigation}
      <section class="py-8">
        <div class="p-10 text-center text-zinc-900 dark:text-white" id="item-list-loader">
          <h5>Loading...</h5>
        </div>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 hidden" id="item-list-container">
          <div class="flex justify-between items-center mb-8">
            <h2 class="font-manrope font-bold text-4xl text-black max-lg:text-center dark:text-white">
              My Item list
            </h2>
            <router-link href='/additem' class="inlin-block cursor-pointer px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-green-600 hover:bg-green-700 rounded-xl">Add Item</router-link>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" id="product-listings">
          </div>
        </div>
      </section>
    `;
  }
}
