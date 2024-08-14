import mainViewClass from "../../../default/mainView.class";
import topNavigation from "../../../modules/top-nav/top-navigation";
import { initTopNavigation } from "../../../modules/top-nav/top-navigation.service";
import { getJobItems } from "./jobList.service";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle("Jobs | Humanizing Data");
  }

  async getHtml() {
    let jobList: any = await getJobItems();
    if (!jobList?.length) {
      jobList = `
        <p class="text-zinc-900 dark:text-white">There is no jobs currently</p>
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
              All Available Jobs
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" id="item-listings">
            ${jobList}
          </div>
        </div>
      </section>
    `;
  }
}
