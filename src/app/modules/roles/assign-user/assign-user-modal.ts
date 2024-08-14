import {
  getSelectedUserRoles,
  handleAssignRoleToUser,
  handleRemoveRoleFromUser,
  handleSearchChange,
} from "./assign-user.service";

(window as any).handleSearchChange = handleSearchChange;
(window as any).getSelectedUserRoles = getSelectedUserRoles;
(window as any).handleAssignRoleToUser = handleAssignRoleToUser;
(window as any).handleRemoveRoleFromUser = handleRemoveRoleFromUser;

export default async function assignUserRoleModalHTML() {
  return `
    <div id="assign-user-role-modal" class="fixed hidden z-50 inset-0 bg-gray-900 bg-opacity-60 dark:bg-gray-200 dark:bg-opacity-40 overflow-y-auto h-full w-full px-4">
        <div class="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-2xl text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            <div class="flex justify-between px-4 pt-4">
                <h3 id="roleTitle" class="text-xl font-normal text-zinc-900 dark:text-white my-0">Assign User Roles</h3>
                <button onclick="closeModal('assign-user-role-modal')" type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
                </svg>
                </button>
            </div>
        
            <div class="p-6 pt-0">                
                <div class="my-4">
                    <label for="search" class="block text-sm font-medium leading-6">Search User<span
                        class="text-rose-400">*</span></label>
                    <div class="mt-2">
                        <input type="text" name="search" id="search" required onchange="handleSearchChange(event)"
                        class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                    </div>
                </div>

                <ul class="list-none ps-0" id="search-users-lists">
                </ul>

                <h4 class="text-xl font-bold mb-2">Selected User Roles</h4>
                <ul class="list-none ps-0" id="user-roles-lists">

                </ul>
        
                <div class="text-right">
                    <button type="button" onclick="closeModal('assign-user-role-modal')"
                        class="text-gray-900 bg-white hover:bg-gray-300 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
                        data-modal-toggle="delete-user-modal">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
}
