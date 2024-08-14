import mainViewClass from "../../../default/mainView.class";
import topNavigation from "../../../modules/top-nav/top-navigation";
import { initTopNavigation } from "../../../modules/top-nav/top-navigation.service";
import { getAllAppliedJobs } from "./appliedJobs.service";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle("Listing Item");
  }

  async getHtml() {
    const allJobs = await getAllAppliedJobs();

    setTimeout(() => {
      initTopNavigation();
    }, 500);

    return `
      ${topNavigation}
      <section class="py-8">
        <!-- <div class="p-10 text-center text-zinc-900 dark:text-white" id="job-list-loader">
          <h5>Loading...</h5>
        </div> -->
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="job-list-container">
          <div class="flex justify-between items-center mb-8">
            <h2 class="font-manrope font-bold text-4xl text-black max-lg:text-center dark:text-white">
              My Applied Jobs
            </h2>
          </div>

          <div class="grid" id="job-listings">
            ${allJobs}
          </div>
        </div>
      </section>
    `;
  }
}
