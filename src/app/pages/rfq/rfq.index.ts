import mainViewClass from "../../default/mainView.class";
import topNavigation from "../../modules/top-nav/top-navigation";
import { getRFQ, openRFQModal } from "./rfq.service";
// import { openModal } from "../listItem/listItem.service";

import rfqModalHTML from "../../modules/rfq-modal/rfq-modal";
import { initTopNavigation } from "../../modules/top-nav/top-navigation.service";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle("Request for Quote | Humanizing Data");
  }

  async getHtml() {
    (window as any).openRFQModal = openRFQModal;

    const rfqList = await getRFQ();
    const rfqModalHTMLCode = await rfqModalHTML();

    setTimeout(() => {
      initTopNavigation();
    }, 500);

    return `
      ${topNavigation}
      <section class="py-8">
        <!-- <div class="p-10 text-center text-zinc-900 dark:text-white" id="items-list-loader">
          <h5>Loading...</h5>
        </div> -->
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="items-list-container">
          <div class="flex justify-between items-center mb-8">
            <h2 class="font-manrope font-bold text-4xl text-black max-lg:text-center dark:text-white">
              My Request For Quotes
            </h2>
            <!-- <router-link href="/" class="inlin-block cursor-pointer px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-green-600 hover:bg-green-700 rounded-xl">Add RFQ</router-link> -->

            <button class="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-700 transition" onclick="openRFQModal()">
              Add RFQ
            </button>
          </div>

          ${rfqList}
          
        </div>
      </section>

      <div id="rfq-modal" class="fixed hidden z-50 inset-0 bg-gray-900 bg-opacity-60 dark:bg-gray-200 dark:bg-opacity-40 overflow-y-auto h-full w-full px-4">
        ${rfqModalHTMLCode}
      </div>
    `;
  }
}
