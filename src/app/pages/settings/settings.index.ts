import mainViewClass from "../../default/mainView.class";
import { sidebarHTML, sidebarMenu } from "../../services/ui/sidebar.service";
import { leaveSettings } from "./partials/leave-settings.index";

export default class extends mainViewClass {
  async getHtml(): Promise<string> {
    return `
      ${await sidebarHTML()}
        <div class="container mx-auto py-4">
            <div class="flex flex-row items-center justify-between">
                <h3 class="text-3xl font-semibold mb-4">Settings</h3>
                ${sidebarMenu()}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="col-span-1 w-full px-6 py-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <ul class="list-none my-4 ps-0">
                        <li class="py-2 px-4 rounded bg-green-800 bg-opacity-75 w-full">
                            <a class="text-gray-100">Leave Settings</a>
                        </li>
                        <li class="py-2 px-4 rounded dark:bg-gray-700 bg-gray-300 bg-opacity-75 w-full">
                            <a class="text-gray-100">More</a>
                        </li>
                    </ul>
                </div>
                <div class="col-span-1 md:col-span-2 w-full px-6 py-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    ${leaveSettings()}
                </div>
            </div>
        </div>
        `;
  }
}
