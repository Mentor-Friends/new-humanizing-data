import mainViewClass from '../../default/mainView.class.ts';
import topNavigation from '../../modules/top-nav/top-navigation.ts';
import { getProducts } from './listing.service.ts';

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle('Listing Item');
  }

  async getHtml() {
    const prouductList = await getProducts()
    return `
      ${topNavigation}
      <section class="py-8">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center mb-8">
            <h2 class="font-manrope font-bold text-4xl text-black max-lg:text-center">
              Product list
            </h2>
            <router-link href='/' class="inlin-block cursor-pointer px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-green-600 hover:bg-green-700 rounded-xl">Add Item</router-link>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" id="product-listings">
            ${prouductList}
          </div>
        </div>
      </section>
    `
  }
}

