import {
  generateMonthOptions,
  generateYearOptions,
} from "../../../pages/attendance/attendance.helper";
import { handleExportEmployeesAteendanceModal } from "../../../pages/attendance/employees-attendance/employees-attendance.service";
import { exportUserAttendance } from "./export-attendance.service";

export function exportEmployeesAteendanceModalHTML() {
  (window as any).handleExportEmployeesAteendanceModal =
    handleExportEmployeesAteendanceModal;
  (window as any).exportUserAttendance = exportUserAttendance;
  return `
        <div id="export-employees-ateendance" class="fixed hidden print:hidden z-50 inset-0 bg-gray-900 bg-opacity-60 dark:bg-gray-200 dark:bg-opacity-40 overflow-y-auto h-full w-full px-4">
            <div class="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-2xl text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                <div class="flex justify-between px-4 pt-4">
                    <h3 id="roleTitle" class="text-xl font-normal text-zinc-900 dark:text-white my-0">Export User Attendance</h3>
                    <button onclick="closeModal('export-employees-ateendance')" type="button"
                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"></path>
                    </svg>
                    </button>
                </div>
            
                <div class="p-6 pt-0">
                    <form method="post" onsubmit="exportUserAttendance(event)" name="exportEmployeesAttendanceForm" id="exportEmployeesAttendanceForm">

                        <div class="my-4">
                            <label for="export-year" class="block text-sm font-medium leading-6 text-gray-900">Year<span
                                class="text-rose-400">*</span></label>
                            <div class="mt-2">
                                <select 
                                    name="export-year" 
                                    id="export-year"
                                    class="block w-full rounded-md border-0 px-3 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                                    ${generateYearOptions()}
                                </select>
                            </div>
                        </div>
                        <div class="my-4">
                            <label for="export-month" class="block text-sm font-medium leading-6 text-gray-900">Month<span
                                class="text-rose-400">*</span></label>
                            <div class="mt-2">
                                <select 
                                    name="export-month" 
                                    id="export-month"
                                    class="block w-full rounded-md border-0 px-3 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                                    ${generateMonthOptions()}
                                </select>
                            </div>
                        </div>
                        <div class="my-4">
                            <label for="export-format" class="block text-sm font-medium leading-6 text-gray-900">Export Format<span
                                class="text-rose-400">*</span></label>
                            <div class="mt-2">
                                <select 
                                    name="export-format" 
                                    id="export-format"
                                    class="block w-full rounded-md border-0 px-3 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                                    <option value="pdf" selected>PDF</option>
                                    <option value="csv">CSV</option>
                                </select>
                            </div>
                        </div>
            
                        <div class="text-right">
                            <button type="button" onclick="closeModal('export-employees-ateendance')"
                                class="text-gray-900 bg-white hover:bg-gray-300 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
                                data-modal-toggle="delete-user-modal">
                                Cancel
                            </button>
                            <button type="submit"
                                class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
                                Export
                            </button>
                        </div>
                    </form>
          
                </div>
            </div>
        </div>
    `;
}
