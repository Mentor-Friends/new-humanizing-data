import mainViewClass from "../../default/mainView.class";
import { sidebarHTML, sidebarMenu } from "../../services/sidebar.service";
import { populateLeaveRequest } from "./leave.service";

export default class extends mainViewClass {
  async getHtml(): Promise<string> {
    setTimeout(() => {
      populateLeaveRequest();
    }, 100);
    return `
      ${await sidebarHTML()}
        <div class="container mx-auto py-4">
            <div class="flex flex-row items-center justify-between">
                <h3 class="text-2xl font-semibold mb-4">Employee Leave</h3>
                ${sidebarMenu()}
            </div>
            <div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">DP</th>
                                <th scope="col" class="px-6 py-3">Name</th>
                                <th scope="col" class="px-6 py-3">Carry Over</th>
                                <th scope="col" class="px-6 py-3">Paid Leave</th>
                                <th scope="col" class="px-6 py-3">Sick Leave</th>
                                <th scope="col" class="px-6 py-3">Total Remaining Leave</th>
                                <th scope="col" class="px-6 py-3">Leave Taken</th>
                            </tr>
                        </thead>
                        <tbody id="leave-requests">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;
  }
}
