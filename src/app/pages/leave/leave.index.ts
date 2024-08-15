import mainViewClass from "../../default/mainView.class";
import { getLocalStorageData } from "../../services/helper.service";
import { sidebarHTML, sidebarMenu } from "../../services/ui/sidebar.service";
import { getCompanyLeave, populateLeaveRequest } from "./leave.service";

export default class extends mainViewClass {
  async getHtml(): Promise<string> {
    const profileStorageData: any = await getLocalStorageData();
    const token = profileStorageData?.token;
    const companyLeave: any = await getCompanyLeave(token);

    setTimeout(() => {
      populateLeaveRequest(companyLeave);
    }, 100);
    return `
      ${await sidebarHTML()}
        <div class="container mx-auto py-4">
            <div class="flex flex-row items-center justify-between">
                <h3 class="text-2xl font-semibold mb-4">Employee Leave - 2024</h3>
                ${sidebarMenu()}
            </div>
            <div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                            <tr class="text-nowrap">
                                <th scope="col" class="px-6 py-3">DP</th>
                                <th scope="col" class="px-6 py-3">Name</th>
                                <th scope="col" class="px-6 py-3">Carry Over</th>
                                <th scope="col" class="px-6 py-3">Unpaid Leave</th>
                                <th scope="col" class="px-6 py-3">
                                  <div class="flex flex-row gap-1">
                                    <span>Paid Leave</span> 
                                    <span class="text-xs text-gray-500">
                                      (${companyLeave.paidLeave})
                                    </span>
                                  </div>
                                </th>
                                <th scope="col" class="px-6 py-3">
                                  <div class="flex flex-row gap-1">
                                    <span>Sick Leave</span> 
                                    <span class="text-xs text-gray-500">
                                      (${companyLeave.sickLeave})
                                    </span>
                                  </div>
                                </th>
                                <th scope="col" class="px-6 py-3">Total Leave Taken</th>
                                <th scope="col" class="px-6 py-3">Total Remaining Leave</th>
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
