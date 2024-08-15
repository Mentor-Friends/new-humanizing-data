import { applyLeaveSubmit } from "./apply-leave.service";

export default async function applyLeaveModalHTML() {
  (window as any).applyLeaveSubmit = applyLeaveSubmit;
  return `
      <div id="apply-leave-modal" class="fixed hidden z-50 inset-0 bg-gray-900 bg-opacity-60 dark:bg-gray-200 dark:bg-opacity-40 overflow-y-auto h-full w-full px-4">
          <div class="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-2xl text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
              <div class="flex justify-between px-4 pt-4">
                  <h3 id="roleTitle" class="text-xl font-normal text-zinc-900 dark:text-white my-0">Apply Leave Request</h3>
                  <button onclick="closeModal('apply-leave-modal')" type="button"
                  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"></path>
                  </svg>
                  </button>
              </div>
          
              <div class="p-6 pt-0">
                  <form method="post" onsubmit="applyLeaveSubmit(event)" name="applyLeaveForm" id="applyLeaveForm">
                      <div class="my-4">
                          <label for="type" class="block text-sm font-medium leading-6">Leave Type<span
                              class="text-rose-400">*</span></label>
                          <div class="mt-2">
                              <select name="type" id="type" required
                              class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                                <option value="" selected>Select an option</option>
                                <option value="unpaid">Unpaid Leave</option>
                                <option value="paid">Paid Leave</option>
                                <option value="sick">Sick Leave</option>
                              </select>
                          </div>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="col-span-1 my-4">
                                <label for="fromdate" class="block text-sm font-medium leading-6">From Date<span
                                    class="text-rose-400">*</span></label>
                                <div class="mt-2">
                                    <input type="date" name="fromdate" id="fromdate" required
                                    class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                                    <p class="text-xs text-gray-500 mt-1">Note: The day you will not be joining from</p>
                                </div>
                            </div>
                            <div class="col-span-1 my-4">
                                <label for="todate" class="block text-sm font-medium leading-6">To Date<span
                                    class="text-rose-400">*</span></label>
                                <div class="mt-2">
                                    <input type="date" name="todate" id="todate" required
                                    class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                                    <p class="text-xs text-gray-500 mt-1">Note: The day till you will not be joining</p>
                                </div>
                            </div>
                      </div>
                    <div class="my-4">
                          <label for="reason" class="block text-sm font-medium leading-6">Reason<span
                              class="text-rose-400">*</span></label>
                          <div class="mt-2">
                              <textarea name="reason" id="reason" required placeholder="Reason"
                              class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900"></textarea>
                          </div>
                      </div>
            
                    <div class="text-right">
                        <button type="button" onclick="closeModal('apply-leave-modal')"
                            class="text-gray-900 bg-white hover:bg-gray-300 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
                            data-modal-toggle="apply-leave-modal">
                            Cancel
                        </button>
                        <button type="submit"
                            class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
                            Apply Leave
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
}
