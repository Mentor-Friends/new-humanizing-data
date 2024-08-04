import mainViewClass from "../../default/mainView.class.ts";
import { dailyAttendanceHTML } from "../../modules/attendance/daily-attendance/daily-attendance.index.ts";
import { initTopNavigation } from "../../modules/top-nav/top-navigation.service.ts";
import topNavigation from "../../modules/top-nav/top-navigation.ts";
import { getLocalStorageData } from "../../services/helper.service.ts";
import { searchUserAttendance } from "../attendance/attendance.helper.ts";
import {
  enableButtons,
  getActiveAttendanceRows,
  tickTimer,
} from "../attendance/user-attendance/attendance.service.ts";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle("Dashboard | Humanizing Data");
  }

  async getHtml() {
    setTimeout(() => {
      initTopNavigation();
    }, 500);

    setTimeout(() => {
      enableButtons(dailyAttendanceList);
      tickTimer();
    }, 1000);

    const profileStorageData: any = await getLocalStorageData();
    const userConceptId = profileStorageData?.userConcept;

    const dailyDate = `${new Date().getFullYear()}-${(
      "0" +
      (new Date().getMonth() + 1)
    ).slice(-2)}-0${new Date().getDate()}`;
    const dailyAttendanceList = await searchUserAttendance(
      userConceptId,
      dailyDate
    );
    const activeAttendanceRowHTML = await getActiveAttendanceRows(
      dailyAttendanceList
    );

    return `
      ${topNavigation}

      <div class="container mx-auto my-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="w-full px-6 py-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div class="mx-auto my-8 max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto pt-20 text-zinc-900 dark:text-white dark:bg-gray-900">
            <h1>Welcome to <strong>Humanizing Data</strong> !</h1>
            <p class="mt-8">We're excited to have you on board and look forward to helping you with your software development needs. Our team is dedicated to providing you with the highest level of service and support, and we're here to answer any questions you may have along the way. Thank you for choosing HumanizingData.com, and we can't wait to see what we can achieve together!</p>
          </div>
        </div>
        <div class="w-full px-6 py-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            ${dailyAttendanceHTML(activeAttendanceRowHTML)}
        </div>
      </div>
    `;
  }
}
