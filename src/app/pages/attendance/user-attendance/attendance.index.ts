import mainViewClass from "../../../default/mainView.class";
import { dailyAttendanceHTML } from "../../../modules/attendance/daily-attendance/daily-attendance.index";
import topNavigation from "../../../modules/top-nav/top-navigation";
import { initTopNavigation } from "../../../modules/top-nav/top-navigation.service";
import { getLocalStorageData } from "../../../services/helper.service";
import {
  generateMonthOptions,
  generateYearOptions,
  getUserMonthlyAttendanceRows,
  searchUserAttendance,
} from "../attendance.helper";
import { handleMonthlyDateChange } from "./attendance.service";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle("Attendance");
  }

  async getHtml(): Promise<string> {
    (window as any).handleMonthlyDateChange = handleMonthlyDateChange;

    const dailyDate = `${new Date().getFullYear()}-${(
      "0" +
      (new Date().getMonth() + 1)
    ).slice(-2)}-0${new Date().getDate()}`;
    const monthlyDate = `${new Date().getFullYear()}-${(
      "0" +
      (new Date().getMonth() + 1)
    ).slice(-2)}`;

    const profileStorageData: any = await getLocalStorageData();
    const userConceptId = profileStorageData?.userConcept;

    const [dailyAttendanceList, monthlyAttendanceList] = await Promise.all([
      searchUserAttendance(userConceptId, dailyDate),
      searchUserAttendance(userConceptId, monthlyDate),
    ]);
    console.log(
      monthlyAttendanceList,
      "monthlyAttendanceList",
      dailyAttendanceList,
      "dailyAttendanceList",
      dailyDate
    );

    const attendanceRowHTML = await getUserMonthlyAttendanceRows(
      monthlyAttendanceList,
      monthlyDate
    );

    setTimeout(() => {
      initTopNavigation();
    }, 500);

    return `
        ${topNavigation}

        <div class="container mx-auto my-4 text-gray-800">
          ${await dailyAttendanceHTML()}

          <div class="w-full px-6 py-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div class="flex flex-row items-center justify-between mb-4">
                  <h4 class="text-xl font-bold">Monthly Attendance</h4>
                  <div class="flex flex-row gap-4 items-center">
                      <div class="">
                          <!-- <label for="filter-attendance-year" class="block text-sm font-medium leading-6">For the month of</label> -->
                          <select id="filter-attendance-year" name="filter-attendance-year" onchange="handleMonthlyDateChange()"
                              class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                              ${generateYearOptions()}
                          </select>
                      </div>
                      <div class="">
                          <!-- <label for="filter-attendance-month" class="block text-sm font-medium leading-6">For the month of</label> -->
                          <select id="filter-attendance-month" name="filter-attendance-month" onchange="handleMonthlyDateChange()"
                              class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                              ${generateMonthOptions()}
                          </select>
                      </div>
                  </div>
              </div>

              <div class="relative overflow-x-auto">
                  <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                              <th scope="col" class="px-6 py-3">Date</th>
                              <th scope="col" class="px-6 py-3">Day</th>
                              <th scope="col" class="px-6 py-3">Check In</th>
                              <th scope="col" class="px-6 py-3">Breaks</th>
                              <th scope="col" class="px-6 py-3">Check Out</th>
                              <th scope="col" class="px-6 py-3">Hours</th>
                              <th scope="col" class="px-6 py-3">Status</th>
                              <th scope="col" class="px-6 py-3">Remarks</th>
                          </tr>
                      </thead>
                      <tbody id="monthly-attendance">
                          ${attendanceRowHTML}
                      </tbody>
                  </table>
              </div>
          </div>
        </div>
    `;
  }
}
