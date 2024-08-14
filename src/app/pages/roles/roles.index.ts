import mainViewClass from "../../default/mainView.class";
import initNavigation from "../../modules/home-nav/home-navigation.service";
import assignUserRoleModalHTML from "../../modules/roles/assign-user/assign-user-modal";
import createRoleModalHTML from "../../modules/roles/create/create-role-modal";
import { sidebarHTML, sidebarMenu } from "../../services/sidebar.service";
import { closeRoleModal, getRolesList, openAssignUserRoleModal, openCreateRoleModal, showEditRoleModal } from "./roles.service";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle("Roles");
  }

  async getHtml(): Promise<string> {
    const createRoleModalHTMLCode = await createRoleModalHTML();

    const roleRows = await getRolesList();

    setTimeout(() => {
      initNavigation();
    }, 100);

    (window as any).openCreateRoleModal = openCreateRoleModal;
    (window as any).showEditRoleModal = showEditRoleModal;
    (window as any).closeRoleModal = closeRoleModal;
    (window as any).openAssignUserRoleModal = openAssignUserRoleModal;

    return `
      ${await sidebarHTML()}
      <div class="flex flex-row justify-end px-4 py-2 shadow w-full">${sidebarMenu()}</div>

        <div class="container mx-auto">
            <div class="flex flex-row justify-end mt-4">
                <button onclick="openCreateRoleModal()" class="bg-green-600 cursor-pointer hover:bg-green-900 text-white text-sm leading-6 font-medium py-3 px-6 m-2 rounded-lg">Create</button>
            </div>
            <div class="relative overflow-x-auto">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">Roles</th>
                            <th scope="col" class="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${roleRows}
                    </tbody>
                </table>
            </div>
        </div>

        ${createRoleModalHTMLCode}
        ${await assignUserRoleModalHTML()}
        
        `;
  }
}
