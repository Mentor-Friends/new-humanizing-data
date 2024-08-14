import mainViewClass from "../../../default/mainView.class";
import createViewIndividualProfileModalHTML from "../../../modules/setInterview-modal/setIndividualProfileView-modal";
import createSetInterviewModalHTML from "../../../modules/setInterview-modal/setInterview-modal";
import topNavigation from "../../../modules/top-nav/top-navigation";
import { closeModal, openModal } from "../../../services/modal.service";
import { applyJob, getJobDetails, openIndividualProfileModal, openScheduleInterviewModal, submitUpdateSKUForm } from "./job.service";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle("Job details | Humanizing Data");
  }

  async getHtml() {
    (window as any).openModal = openModal;
    (window as any).closeModal = closeModal;
    (window as any).submitUpdateSKUForm = submitUpdateSKUForm;
    (window as any).applyJob = applyJob;
    (window as any).openScheduleInterviewModal=openScheduleInterviewModal;
    (window as any).openIndividualProfileModal=openIndividualProfileModal;

    
    const jobDetails = await getJobDetails(this.params?.id);
    const scheduleModal= await createSetInterviewModalHTML();
    const IndividualProfileModal= await createViewIndividualProfileModalHTML()
    return `
      ${topNavigation}
      ${scheduleModal}
      ${IndividualProfileModal}
      <section class="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
        <div class="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          ${jobDetails}
        </div>
      </section>
    `;
  }
}
