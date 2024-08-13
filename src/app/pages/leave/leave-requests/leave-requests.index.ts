import mainViewClass from "../../../default/mainView.class";
import applyLeaveModalHTML from "../../../modules/leave/apply-leave/apply-leave.index";
import { closeModal, openModal } from "../../../services/modal.service";
import { sidebarHTML, sidebarMenu } from "../../../services/sidebar.service";
import { leaveStatus } from "../leave.helper";
import { fetchLeaveRequest, handleFilterLeaveStatusChange, populateLeaveRequests } from "./leave-requests.service";

export default class extends mainViewClass {
  async getHtml(): Promise<string> {
    (window as any).openModal = openModal;
    (window as any).closeModal = closeModal;
    (window as any).handleFilterLeaveStatusChange = handleFilterLeaveStatusChange;

    setTimeout(async () => {      
        const leaveRequests: any = await fetchLeaveRequest();
        console.log('leaveRequests', leaveRequests);
        populateLeaveRequests(leaveRequests)
    }, 100)

    let leaveStatusHTML = ''
    for(let [key] of Object.entries(leaveStatus)) {
        leaveStatusHTML += `<option value="${key}">${key}</option>`
    }

    return `
        ${await sidebarHTML()}
        <div class="container mx-auto py-4">
            <div class="flex flex-row items-center justify-between">
                <h3 class="text-2xl font-semibold mb-4">Leave Requests</h3>
                ${sidebarMenu()}
            </div>
            <div class="flex flex-row items-center justify-end gap-4 my-4">
                <div class="">
                    <select id="filter-leave-status" name="filter-leave-status" onchange="handleFilterLeaveStatusChange()"
                        class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                        <option value="">Choose Status</option>
                        ${leaveStatusHTML}
                    </select>
                </div>
                <button onclick="openModal('apply-leave-modal')"
                    class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
                    Apply Leave
                </button>
            </div>
            <div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 text-center">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">DP</th>
                                <th scope="col" class="px-6 py-3">Name</th>
                                <th scope="col" class="px-6 py-3">Type</th>
                                <th scope="col" class="px-6 py-3">From</th>
                                <th scope="col" class="px-6 py-3">To</th>
                                <th scope="col" class="px-6 py-3">Days</th>
                                <th scope="col" class="px-6 py-3">Reason</th>
                                <th scope="col" class="px-6 py-3">Status</th>
                                <th scope="col" class="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody id="leave-requests">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        ${await applyLeaveModalHTML()}
        `;
  }
}
