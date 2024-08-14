import { DAYS } from "../../../constants/time.constants";
import {
  populateAttendanceForm,
  saveAttendanceSetting,
} from "./leave-settings.service";

export function leaveSettings() {
  (window as any).saveAttendanceSetting = saveAttendanceSetting;
  populateAttendanceForm();

  let daysCheckboxHTML = "";
  DAYS.map(
    (day) =>
      (daysCheckboxHTML += `
        <div class="flex items-center mb-2">
            <input id="${day.toLowerCase()}" name="${day.toLowerCase()}" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="${day.toLowerCase()}" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">${day}</label>
        </div>`)
  );
  return `
    <h3 class="text-lg font-bold">Attendance Setting</h3>
    <div>
        <form onsubmit="saveAttendanceSetting(event)">
            <div class="my-4">
                <label for="paidleave" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">Paid Leave<span
                    class="text-rose-400">*</span></label>
                <div class="mt-2">
                    <input type="number" name="paidleave" id="paidleave"
                    class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 dark:text-gray-100">
                </div>
            </div>
            <div class="my-4">
                <label for="sickleave" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">Sick Leave<span
                    class="text-rose-400">*</span></label>
                <div class="mt-2">
                    <input type="number" name="sickleave" id="sickleave"
                    class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 dark:text-gray-100">
                </div>
            </div>
            <div class="my-4">
                <label class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">Working Days<span
                    class="text-rose-400">*</span></label>
                <div class="mt-2">
                ${daysCheckboxHTML}
                </div>
            </div>

            <div class="flex flex-row justify-end">
                <button type="submit" id="attendance-setting-btn" disabled
                    class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
                    Save
                </button>
            </div>
        </form>
    </div>
    `;
}
