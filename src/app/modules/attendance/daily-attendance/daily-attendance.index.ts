import { DAYS } from "../../../constants/time.constants";
import { searchUserAttendance } from "../../../pages/attendance/attendance.helper";
import {
  enableButtons,
  getActiveAttendanceRows,
  tickTimer,
} from "../../../pages/attendance/user-attendance/attendance.service";
import { getLocalStorageData } from "../../../services/helper.service";
import { handleAttendanceClick } from "./daily-attendance.service";

export async function dailyAttendanceHTML() {
  (window as any).handleAttendanceClick = handleAttendanceClick;

  const profileStorageData: any = await getLocalStorageData();
  const userConceptId = profileStorageData?.userConcept;

  const dailyDate = `${new Date().getFullYear()}-${(
    "0" +
    (new Date().getMonth() + 1)
  ).slice(-2)}-${("0" + new Date().getDate()).slice(-2)}`;
  const dailyAttendanceList = await searchUserAttendance(
    userConceptId,
    dailyDate
  );
  const activeAttendanceRowHTML = await getActiveAttendanceRows(
    dailyAttendanceList
  );

  setTimeout(() => {
    enableButtons(dailyAttendanceList);
    tickTimer();
  }, 1000);

  return `
    <div class="flex flex-wrap items-center justify-center gap-4 mb-6">
        <div class="grow flex flex-row items-center justify-around py-8">
            <button onclick="handleAttendanceClick('check-in-btn')" id="checkin-btn" disabled type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:bg-blue-400 dark:bg-blue-500 disabled:cursor-not-allowed">Check In</button>
            <button onclick="handleAttendanceClick('check-out-btn')" id="checkout-btn" disabled type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:bg-blue-400 dark:bg-blue-500 disabled:cursor-not-allowed">Check Out</button>
        </div>
        <div class="grow-[2]">
            <div class="flex flex-col gap-2 mb-4 text-gray-800 dark:text-gray-100">
                <p><b>${DAYS[new Date().getDay()]}, 
                    ${new Date().toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })}</b></p>
                <p>Current time: <span id="tick-timer">7/28/2024, 5:34:31 PM</span></p>
            </div>
            <div class="relative overflow-x-auto">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">Today's Log</th>
                            <th scope="col" class="px-6 py-3">Check In</th>
                            <th scope="col" class="px-6 py-3">Check Out</th>
                            <th scope="col" class="px-6 py-3">Working Time</th>
                        </tr>
                    </thead>
                    <tbody id="daily-attendance">
                        ${activeAttendanceRowHTML}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `;
}
