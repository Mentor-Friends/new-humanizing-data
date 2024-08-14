import mainViewClass from "../../default/mainView.class";
import topNavigation from "../../modules/top-nav/top-navigation";
import { initTopNavigation } from "../../modules/top-nav/top-navigation.service";
import { getListingItems } from "./listingItems.service";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle("All Items Listing | Humanizing Data");
  }

  async getHtml() {
    let itemList: any = await getListingItems();
    if (!itemList?.length) {
      itemList = `
        <p class="text-zinc-900 dark:text-white">There is no items currently</p>
      `;
    }

    setTimeout(() => {
      initTopNavigation();
    }, 10);

    return `
      ${topNavigation}
      <section class="py-8">
        <!-- <div class="p-10 text-center text-zinc-900 dark:text-white" id="items-list-loader">
          <h5>Loading...</h5>
        </div> -->
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="items-list-container">
          <div class="flex justify-between items-center mb-8">
            <h2 class="font-manrope font-bold text-4xl text-black max-lg:text-center dark:text-white">
              All Boomconsole Items
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" id="item-listings">
            ${itemList}
          </div>
        </div>
      </section>
    `;
  }
}
