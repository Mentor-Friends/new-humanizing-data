import mainViewClass from "../../../default/mainView.class";
import applyLeaveModalHTML from "../../../modules/leave/apply-leave/apply-leave.index";
import { toggleDropdownMenuOption } from "../../../services/ui/dropdown.service";
import { getLocalStorageData } from "../../../services/helper.service";
import { closeModal, openModal } from "../../../services/modal.service";
import { sidebarHTML, sidebarMenu } from "../../../services/ui/sidebar.service";
import { hasRole } from "../../roles/role.helper";
import { fetchLeaveRequest, leaveStatus } from "../leave.helper";
import {
  changeLeaveRequestStatus,
  handleLeaveFilterChange,
  populateLeaveRequests,
  populateUserDropdown,
} from "./leave-requests.service";

export default class extends mainViewClass {
  async getHtml(): Promise<string> {
    (window as any).openModal = openModal;
    (window as any).closeModal = closeModal;
    (window as any).toggleDropdownMenuOption = toggleDropdownMenuOption;
    (window as any).handleLeaveFilterChange = handleLeaveFilterChange;
    (window as any).changeLeaveRequestStatus = changeLeaveRequestStatus;

    const isEmployee = await hasRole("ROLE_EMPLOYEE");
    const isEmployerOrAdmin =
      (await hasRole("ROLE_EMPLOYER")) || (await hasRole("ROLE_ADMIN"));

    setTimeout(async () => {
      const profileStorageData: any = await getLocalStorageData();
      const userConceptId = profileStorageData?.userConcept;
      let leaveRequests: any[] = [];
      if (isEmployee) {
        leaveRequests = await fetchLeaveRequest([], userConceptId);
      } else {
        leaveRequests = await fetchLeaveRequest();
        populateUserDropdown();
      }
      console.log("leaveRequests", leaveRequests);
      populateLeaveRequests(leaveRequests);
    }, 100);

    let leaveStatusHTML = "";
    for (let [key] of Object.entries(leaveStatus)) {
      leaveStatusHTML += `<option value="${key}">${key}</option>`;
    }

    return `
        ${await sidebarHTML()}
        <div class="container mx-auto py-4">
            <div class="flex flex-row items-center justify-between">
                <h3 class="text-2xl font-semibold mb-4">Leave Requests</h3>
                ${sidebarMenu()}
            </div>
            <div class="flex flex-row items-center justify-end gap-4 my-4">
                ${
                  isEmployerOrAdmin
                    ? `<div class="">
                            <select id="filter-users" name="filter-users" onchange="handleLeaveFilterChange()"
                                class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                                <option value="">Select User</option>
                            </select>
                        </div>
                    `
                    : ""
                }
                
                <div class="">
                    <select id="filter-leave-status" name="filter-leave-status" onchange="handleLeaveFilterChange()"
                        class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                        <option value="">Choose Status</option>
                        ${leaveStatusHTML}
                    </select>
                </div>
                ${
                  isEmployee
                    ? `<button onclick="openModal('apply-leave-modal')"
                            class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
                            Apply Leave
                        </button>
                    `
                    : ""
                }
                
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
